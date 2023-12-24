const { discordConnProm } = require("../../global/globalConnections");

// Get a guild user's presence
const getPresence = async (adventurer) => {
  const client = await discordConnProm;
  const guildMember = await client.guilds.cache
    .map((guild) => guild.members.fetch(adventurer.discordId))
    .find((x) => x);
  return guildMember.presence;
};

// Get a user's status
const getStatus = (adventurer) =>
  getPresence(adventurer).then(({ status }) => status);

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
    func(reaction, user);
  });
};

module.exports = {
  getStatus,
  sendMessage,
  handleDirectMessage,
  handleReactionAdd,
};
