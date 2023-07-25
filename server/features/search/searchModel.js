const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const searchSchema = Schema(
  {
    title: { type: String, required: true },
    isSecret: { type: Boolean, default: false },
    isFound: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.SEARCH, searchSchema);
