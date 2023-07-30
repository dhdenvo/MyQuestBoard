const bookModel = require("./bookModel");
const pageModel = require("./pageModel");

const getBooks = () => bookModel.findMany();
const getBook = ({ params }) => bookModel.findOne(params.bookId, true);
const getPage = ({ params }) =>
  pageModel.findOne(params.pageId, true).populate("nextPages");

module.exports = {
  getBooks,
  getBook,
  getPage,
};
