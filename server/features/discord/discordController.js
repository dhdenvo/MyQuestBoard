const { completeQuest } = require("../completion/completionController");
const { generateSingleResponse } = require("../shared/helpers/aiHelper");
const alternateModels = require("../shared/helpers/alternateModels");
const { searchStr } = require("../shared/helpers/genericHelper");
const model = require("./discordModel");

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
  // Generate the message using ai & respond to them
  const response = await generateSingleResponse(
    message.content,
    adventurer.aiContext
  );
  await model.sendMessage(adventurer, response);
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
