const { generateSingleResponse } = require("../shared/helpers/aiHelper");
const alternateModels = require("../shared/helpers/alternateModels");
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

const reactionAddHandler = (message) => {
  console.log("HIIIIIII", message);
};

model.handleDirectMessage(directMessageHandler);
model.handleReactionAdd(reactionAddHandler);
module.exports = {
  sendRouteMessage,
};
