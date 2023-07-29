const controller = require("./questController");

module.exports = (router) => {
  router.get("/quests", controller.getQuests);
  router.post("/quests", controller.createQuest);
};
