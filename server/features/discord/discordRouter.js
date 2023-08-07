const controller = require("./discordController");

module.exports = (router) => {
  router.post("/discord", controller.sendRouteMessage);
};
