const { completeQuest } = require("../completion/completionController");
const {
  generateConversationResponse,
  generateSingleResponse,
} = require("../shared/helpers/aiHelper");
const alternateModels = require("../shared/helpers/alternateModels");
const { searchStr } = require("../shared/helpers/genericHelper");
const model = require("./discordModel");
const { RESPONSE_CONTEXTS } = require("./discordConfig.json");
const { COMPLETION_ROLES } = require("../shared/configs/aiConfig.json");

// Create the constants required for the context feature
const CONTEXT_FUNCS = {};
const CONTEXT_IDS = [];
const CONTEXT_STRS = RESPONSE_CONTEXTS.map((cont) => {
  if (typeof cont === typeof "") return cont;
  CONTEXT_IDS.push(cont.id);
  CONTEXT_FUNCS[cont.id] = require(`./messageHandlers/${cont.func}.js`);
  return `If ${cont.condition} then have the response start with "${cont.id}" and generate a response about "${cont.response}"`;
});

// Send a generic discord message to the authenticated user
const sendRouteMessage = async ({ adventurer, body }) => {
  let message = body?.message;
  if (!message)
    message = await generateSingleResponse("Generate a cool message to send");
  return model.sendMessage(adventurer, message);
};

// The handler for direct messages
const directMessageHandler = async (message) => {
  // Get the user that made the direct message
  const adventurer = await alternateModels.ADVENTURER.findOne({
    discordId: message?.author?.id,
  });
  // If the discord user isn't an adventurer, ignore them
  if (!adventurer) return;
  const context = adventurer.aiContext
    ? [adventurer.aiContext, ...CONTEXT_STRS]
    : CONTEXT_STRS;
  const conversation = adventurer.aiConversation;
  const userMsg = { content: message.content, role: COMPLETION_ROLES.USER };
  conversation.push(userMsg);
  // Generate the message using ai & respond to them
  let genMessage = await generateConversationResponse(context, conversation);

  // See if a context function was called
  const matchedId = CONTEXT_IDS.find((id) => genMessage.startsWith(id));
  if (matchedId) genMessage = genMessage.replace(matchedId, "").trim();

  // Send the assistant's discord message
  const sendDiscProm = model.sendMessage(adventurer, genMessage);
  // Update the player's conversation transcript
  const assistMsg = { content: genMessage, role: COMPLETION_ROLES.ASSISTANT };
  const updateAdvenProm = alternateModels.ADVENTURER.updateOne(
    { _id: adventurer._id },
    { $push: { aiConversation: { $each: [userMsg, assistMsg] } } }
  );
  await Promise.all([sendDiscProm, updateAdvenProm]);
  if (matchedId) await CONTEXT_FUNCS[matchedId](adventurer, message);
};

const reactionAddHandler = async (reaction, user) => {
  // Get the adventurer that reacted
  const adventurer = await alternateModels.ADVENTURER.findOne({
    discordId: user?.id,
  });

  const emoji = reaction?._emoji.name;
  // Use regex to search for the quest id in the message
  const message = reaction?.message?.content;
  if (!message) return;
  const messageQuery = searchStr(
    message,
    `${process.env.GUILD_ADDRESS}/quest/`,
    24
  );
  if (!messageQuery?.length) return;
  // Reverse the message to grab the emojis from the back
  const emojiOptions = [...message.slice(0, message.indexOf("[⠀]"))]
    .reverse()
    .slice(0, messageQuery.length);
  const questId = messageQuery[emojiOptions.indexOf(emoji)];

  // Complete the quest for the adventurer
  await completeQuest({ adventurer, params: { questId } });
};

model.handleDirectMessage(directMessageHandler);
model.handleReactionAdd(reactionAddHandler);
module.exports = {
  sendRouteMessage,
};
