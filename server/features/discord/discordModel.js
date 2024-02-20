const { discordConnProm } = require("../../global/globalConnections");

// Pull a test message for checking if a emoji is valid
let testMsgRes;
let testMessage = new Promise((res) => (testMsgRes = res));
discordConnProm.then(async (client) => {
  const channel = await client.channels.fetch(process.env.DISCORD_TEST_CHANNEL);
  const message = await channel.messages.fetch(
    process.env.DISCORD_TEST_MESSAGE
  );
  testMsgRes(message);
});

// Get an adventurer's discord user
const getUser = async (adventurer) => {
  if (!adventurer.discordId) return;
  const client = await discordConnProm;
  return await client.users.fetch(adventurer.discordId);
};

// Get an adventurer's guild member from any guild
const getAnyGuildUser = async (adventurer) => {
  if (!adventurer.discordId) return;
  const client = await discordConnProm;
  return await client.guilds.cache
    .map((guild) => guild.members.fetch(adventurer.discordId))
    .find((x) => x);
};

// Get a guild user's presence
// (Note: returns undefined if user hasn't come online discord since app start)
const getPresence = (adventurer) =>
  getAnyGuildUser(adventurer).then((guildMember) => guildMember?.presence);

// Get a user's status
const getStatus = (adventurer) =>
  getPresence(adventurer).then((presence) => presence?.status);

// Send a discord direct message to an adventurer
const sendMessage = async (adventurer, message) => {
  const discUser = await getUser(adventurer);
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

// Check if a reaction is a valid reaction
const checkReaction = (emoji) =>
  testMessage.then((msg) =>
    msg
      .react(emoji)
      .then(() => true)
      .catch(() => false)
  );

module.exports = {
  getStatus,
  sendMessage,
  handleDirectMessage,
  handleReactionAdd,
  checkReaction,
};
