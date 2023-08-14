const bookModel = require("./bookModel");
const pageModel = require("./pageModel");
const { Types } = require("mongoose");

const getBooks = ({ adventurer }) =>
  bookModel.findMany({ adventurer: adventurer._id });
const getBook = ({ params }) =>
  bookModel.findOne(params.bookId, true).populate("paths");
const getPage = ({ params }) =>
  pageModel.findOne(params.pageId, true).populate("nextPages");
const savePath = ({ params }) =>
  bookModel.updateOne(
    { _id: params.bookId },
    { $push: { paths: new Types.ObjectId(params.pageId) } }
  );

module.exports = {
  getBooks,
  getBook,
  getPage,
  savePath,
};
