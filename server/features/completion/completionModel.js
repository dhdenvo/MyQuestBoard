const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const questSchema = Schema({
  adventurer: {
    type: Schema.Types.ObjectId,
    ref: COLLECTION_NAMES.ADVENTURER,
    required: true,
  },
  quest: {
    type: Schema.Types.ObjectId,
    ref: COLLECTION_NAMES.QUEST,
    required: true,
  },
  completedOn: { type: Date, default: Date.now },
});

module.exports = new ModelTemplate(questSchema, COLLECTION_NAMES.QUEST);
