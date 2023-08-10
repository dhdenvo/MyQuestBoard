const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const bookSchema = Schema(
  {
    title: { type: String, required: true },
    firstPage: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.PAGE,
      default: null,
    },
    description: { type: String, default: "" },
    originalSource: { type: String, default: "" },
    hasImage: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.BOOK, bookSchema);
