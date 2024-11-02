const controller = require("./rankController");

module.exports = (router) => {
  router.get("/rank", controller.getRanks);
};
