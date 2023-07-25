const controller = require("./adventurerController");

module.exports = (router) => {
  router.get("/adventurers", controller.getAdventurers);
  router.post("/adventurer", controller.createAdventurer);
};
