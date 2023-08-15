const bookModel = require("./bookModel");
const pageModel = require("./pageModel");
const { Types } = require("mongoose");
const { COLLECTION_NAMES } = require("../../global/config.json");

const getBooks = ({ adventurer }) =>
  bookModel.findMany({ adventurer: adventurer._id });
const getBook = ({ params }) =>
  bookModel.findOne(params.bookId, true).populate("paths");
const savePath = ({ params }) =>
  bookModel.updateOne(
    { _id: params.bookId },
    { $push: { paths: new Types.ObjectId(params.pageId) } }
  );
const deletePath = ({ params }) =>
  bookModel.updateOne(
    { _id: params.bookId },
    { $pull: { paths: new Types.ObjectId(params.pageId) } }
  );

// Get the page along with its next pages with a value if the next pages follow the given path
const getPage = async ({ params, query }) => {
  const nextPagePipeline = [
    { $match: { prevPage: new Types.ObjectId(params.pageId) } },
  ];
  // If the path is passed, append the path searching system
  if (query.path) {
    nextPagePipeline.push({
      $graphLookup: {
        from: COLLECTION_NAMES.PAGE,
        startWith: "$nextPages",
        connectFromField: "nextPages",
        connectToField: "_id",
        as: "followsPath",
      },
    });
    nextPagePipeline.push({
      $addFields: {
        followsPath: {
          $or: [
            {
              $in: [
                new Types.ObjectId(query.path),
                {
                  $map: { input: "$followsPath", as: "temp", in: "$$temp._id" },
                },
              ],
            },
            { $eq: [new Types.ObjectId(query.path), "$_id"] },
          ],
        },
      },
    });
  }
  nextPagePipeline.push({
    $project: { _id: 1, pageTitle: 1, pageNum: 1, followsPath: 1 },
  });

  return pageModel.aggregate([
    { $match: { _id: new Types.ObjectId(params.pageId) } },
    {
      $lookup: {
        from: COLLECTION_NAMES.PAGE,
        pipeline: nextPagePipeline,
        as: "nextPages",
      },
    },
    {
      $lookup: {
        from: COLLECTION_NAMES.PAGE,
        let: { prevPage: "$prevPage" },
        pipeline: [
          { $match: { $expr: { $eq: ["$$prevPage", "$_id"] } } },
          { $project: { pageTitle: 1, pageNum: 1 } },
        ],
        as: "prevPage",
      },
    },
    { $unwind: { path: "$prevPage", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: COLLECTION_NAMES.BOOK,
        let: { book: "$book" },
        pipeline: [
          { $match: { $expr: { $eq: ["$$book", "$_id"] } } },
          { $project: { paths: 1, title: 1 } },
        ],
        as: "book",
      },
    },
    { $unwind: { path: "$book", preserveNullAndEmptyArrays: true } },
    { $addFields: { pathSaved: { $in: ["$_id", "$book.paths"] } } },
  ]);
};

module.exports = {
  getBooks,
  getBook,
  getPage,
  savePath,
  deletePath,
};
