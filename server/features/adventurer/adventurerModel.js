const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const adventurerSchema = Schema({
  name: { type: String, required: true },
  rankPoints: { type: Number, default: 0 },
  rank: String,
  discordId: String,
});

module.exports = new ModelTemplate(
  adventurerSchema,
  COLLECTION_NAMES.ADVENTURER
);
