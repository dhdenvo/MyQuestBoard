const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const rankSchema = Schema(
  {
    rank: { type: String, required: true },
    promotion: Number,
    demotion: Number,
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.RANK, rankSchema);
