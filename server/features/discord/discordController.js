const model = require("./discordModel");

const sendRouteMessage = ({ adventurer, body }) =>
  model.sendMessage(adventurer, body?.message);

module.exports = {
  sendRouteMessage,
};
