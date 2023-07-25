const controller = require("./completionController");

module.exports = (router) => {
  router.post("/quest/:id/complete", controller.completeQuest);
};
