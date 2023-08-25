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

// Handle direct messages using a given function
const handleReactionAdd = async (func) => {
  const client = await discordConnProm;
  client.on("messageReactionAdd", async (reaction, user) => {
    if (user?.bot || reaction?.message?.guildId) return;
    func(reaction);
  });
};

module.exports = {
  sendMessage,
  handleDirectMessage,
  handleReactionAdd,
};
