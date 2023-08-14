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
    adventurer: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.ADVENTURER,
      default: null,
    },
    description: { type: String, default: "" },
    originalSource: { type: String, default: "" },
    hasImage: { type: Boolean, default: false },
    paths: {
      type: [{ type: Schema.Types.ObjectId, ref: COLLECTION_NAMES.PAGE }],
      default: [],
    },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.BOOK, bookSchema);
