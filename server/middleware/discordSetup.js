const { Client, Events, GatewayIntentBits } = require("discord.js");
const { discordSetConn } = require("../global/globalConnections");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Runs callback when the client is ready
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  discordSetConn(c);
});

// Log in to Discord with the client's token
client.login(process.env.DISCORD_TOKEN);
