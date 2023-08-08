const { discordConnProm } = require("../../global/globalConnections");

const sendMessage = async (adventurer, message) => {
  const client = await discordConnProm;
  const { discordId } = adventurer;
  const discUser = await client.users.fetch(discordId);
  return await discUser.send(message);
};

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
