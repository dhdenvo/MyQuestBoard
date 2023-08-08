const { generateSingleResponse } = require("../shared/helpers/aiHelper");
const alternateModels = require("../shared/helpers/alternateModels");
const model = require("./discordModel");

const sendRouteMessage = async ({ adventurer, body }) => {
  let message = body?.message;
  if (!message)
    message = await generateSingleResponse("Generate a cool message to send");
  return model.sendMessage(adventurer, message);
};

const directMessageHandler = async (message) => {
  const adventurer = await alternateModels.ADVENTURER.findOne({
    discordId: message?.author?.id,
  });
  if (!adventurer) return;
  const response = await generateSingleResponse(
    message.content,
    adventurer.aiContext
  );
  model.sendMessage(adventurer, response);
};

model.handleDirectMessage(directMessageHandler);
module.exports = {
  sendRouteMessage,
};
