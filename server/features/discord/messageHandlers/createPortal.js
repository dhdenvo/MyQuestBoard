const { connect, disconnect } = require("ngrok");
const { PORTAL_TIMEOUT } = require("../discordConfig.json");

module.exports = (adv, msg, genMessage) =>
  connect(process.env.PORT).then((url) => {
    setTimeout(() => disconnect(url), PORTAL_TIMEOUT);
    return `${genMessage}\n${url}`;
  });
