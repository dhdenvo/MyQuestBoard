const controller = require("./imageController");

module.exports = (router) => {
  router.get("/image/:folder/:filename", controller.getImage);
  router.post("/image", controller.saveUrl);
};
