const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");
const { FREQUENCY_TYPES } = require("./questConfig.json");

const questSchema = Schema(
  {
    adventurer: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.ADVENTURER,
      required: true,
    },
    title: { type: String, required: true },
    fullView: { type: [String] },
    rankPoints: { type: Number, default: 0 },
    isSecret: { type: Boolean, default: false },
    frequency: {
      type: String,
      default: FREQUENCY_TYPES.DAILY,
      enum: Object.values(FREQUENCY_TYPES),
    },
    frequencyDecider: { type: Schema.Types.Mixed },
    reminderFrequency: { type: Number, default: 0 },
    timeLimit: { type: Number, default: 0 },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.QUEST, questSchema);
