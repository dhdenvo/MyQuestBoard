const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const pageSchema = Schema(
  {
    pageNum: { type: String, required: true },
    pageTitle: String,
    book: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.BOOK,
      required: true,
    },
    nextPages: {
      type: [{ type: Schema.Types.ObjectId, ref: COLLECTION_NAMES.PAGE }],
      default: [],
    },
    prevPage: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.PAGE,
      default: null,
    },
    content: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.PAGE, pageSchema);
