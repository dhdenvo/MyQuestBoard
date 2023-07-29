const clientPromise = require("./discordModel");

const sendMessage = async ({ adventurer, body }) => {
  const { discordId } = adventurer;
  const { message } = body;
  const client = await clientPromise;
  const discUser = await client.users.fetch(discordId);
  return await discUser.send(message);
};

module.exports = {
  sendMessage,
};
