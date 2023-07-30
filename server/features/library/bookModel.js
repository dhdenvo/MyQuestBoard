const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const bookSchema = Schema(
  {
    title: { type: String, required: true },
    firstPage: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.PAGE,
      required: true,
    },
    description: { type: String, default: "" },
    originalLink: { type: String, default: "" },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.BOOK, bookSchema);
