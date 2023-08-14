const bookModel = require("./bookModel");
const pageModel = require("./pageModel");
const { Types } = require("mongoose");

const getBooks = ({ adventurer }) =>
  bookModel.findMany({ adventurer: adventurer._id });
const getBook = ({ params }) =>
  bookModel.findOne(params.bookId, true).populate("paths");
const savePath = ({ params }) =>
  bookModel.updateOne(
    { _id: params.bookId },
    { $push: { paths: new Types.ObjectId(params.pageId) } }
  );

// Get the page along with its next pages with a value if the next pages follow the given path
const getPage = async ({ params, query }) =>
  pageModel.aggregate(
    [
      { $match: { _id: new Types.ObjectId(params.pageId) } },
      {
        $lookup: {
          from: COLLECTION_NAMES.PAGE,
          pipeline: [
            { $match: { prevPage: new Types.ObjectId(params.pageId) } },
            {
              $graphLookup: {
                from: COLLECTION_NAMES.PAGE,
                startWith: "$nextPages",
                connectFromField: "nextPages",
                connectToField: "_id",
                as: "followsPath",
              },
            },
            {
              $addFields: {
                followsPath: {
                  $or: [
                    {
                      $in: [
                        new Types.ObjectId(query.path),
                        {
                          $map: {
                            input: "$followsPath",
                            as: "temp",
                            in: "$$temp._id",
                          },
                        },
                      ],
                    },
                    { $eq: [new Types.ObjectId(query.path), "$_id"] },
                  ],
                },
              },
            },
            { $project: { _id: 0, pageTitle: 1, pageNum: 1, followsPath: 1 } },
          ],
          as: "nextPages",
        },
      },
    ],
    false
  );

module.exports = {
  getBooks,
  getBook,
  getPage,
  savePath,
};
