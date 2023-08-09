const controller = require("./imageController");

module.exports = (router) => {
  router.get("/image/:image", controller.getImage);
  router.post("/image", controller.saveUrl);
};
