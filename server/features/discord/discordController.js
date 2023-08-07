const clientPromise = require("./discordModel");

const sendMessage = async (adventurer, message) => {
  const { discordId } = adventurer;
  const client = await clientPromise;
  const discUser = await client.users.fetch(discordId);
  return await discUser.send(message);
};

module.exports = {
  sendMessage,
};
