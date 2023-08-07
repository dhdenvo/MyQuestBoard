const { generateSingleResponse } = require("../shared/helpers/aiHelper");
const model = require("./discordModel");

const sendRouteMessage = async ({ adventurer, body }) => {
  let message = body?.message;
  if (!message)
    message = await generateSingleResponse("Generate a cool message to send");
  return model.sendMessage(adventurer, message);
};

module.exports = {
  sendRouteMessage,
};
