const controller = require("./discordController");

module.exports = (router) => {
  router.post("/discord", ({ adventurer, body }) =>
    controller.sendMessage(adventurer, body?.message)
  );
};
