const { discordConn } = require("../../global/globalConnections");

const sendMessage = async (adventurer, message) => {
  const client = discordConn();

  const { discordId } = adventurer;
  const discUser = await client.users.fetch(discordId);
  return await discUser.send(message);
};

module.exports = {
  sendMessage,
};
