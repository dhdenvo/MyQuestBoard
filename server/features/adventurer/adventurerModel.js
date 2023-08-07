const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const adventurerSchema = Schema(
  {
    name: { type: String, required: true },
    rankPoints: { type: Number, default: 0, min: 0 },
    rank: String,
    discordId: String,
    aiContext: String,
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(
  COLLECTION_NAMES.ADVENTURER,
  adventurerSchema
);
