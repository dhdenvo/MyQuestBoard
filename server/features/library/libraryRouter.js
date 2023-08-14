const controller = require("./libraryController");

module.exports = (router) => {
  router.get("/library/books", controller.getBooks);
  router.get("/library/book/:bookId", controller.getBook);
  router.get("/library/page/:pageId", controller.getPage);
  router.put("/library/book/:bookId/page/:pageId", controller.savePath);
};
