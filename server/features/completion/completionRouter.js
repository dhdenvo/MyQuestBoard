const controller = require("./completionController");

module.exports = (router) => {
  router.post("/quest/:questId/complete", controller.completeQuest);
  router.get("/quest/summary", controller.getCompletionSummary);
};
