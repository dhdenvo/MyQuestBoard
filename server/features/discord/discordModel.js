const { discordConnProm } = require("../../global/globalConnections");

// Send a discord direct message to an adventurer
const sendMessage = async (adventurer, message) => {
  const client = await discordConnProm;
  const { discordId } = adventurer;
  if (!discordId) return;
  const discUser = await client.users.fetch(discordId);
  return await discUser.send(message);
};

// Handle direct messages using a given function
const handleDirectMessage = async (func) => {
  const client = await discordConnProm;
  client.on("messageCreate", async (message) => {
    if (message?.author?.bot || message?.guildId) return;
    func(message);
  });
};

module.exports = {
  sendMessage,
  handleDirectMessage,
};
