const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const questSchema = Schema({
  adventurer: {
    type: Schema.Types.ObjectId,
    ref: COLLECTION_NAMES.ADVENTURER,
    required: true,
  },
  title: { type: String, required: true },
  fullView: { type: [Strings] },
  rankPoints: { type: Number, default: 0 },
  isSecret: { type: Boolean, default: false },
});

module.exports = new ModelTemplate(questSchema, COLLECTION_NAMES.QUEST);
