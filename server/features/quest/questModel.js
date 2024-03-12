const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");
const { FREQUENCY_TYPES } = require("../shared/configs/questConfig.json");

const questSchema = Schema(
  {
    adventurer: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.ADVENTURER,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullView: { type: [String], default: [] },
    rankPoints: { type: Number, default: 0 },
    isSecret: { type: Boolean, default: false },
    frequency: {
      type: String,
      default: FREQUENCY_TYPES.DAILY,
      enum: Object.values(FREQUENCY_TYPES),
    },
    dueDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    validUntil: {
      type: Number,
      default: function () {
        const DEFAULTS = {
          [FREQUENCY_TYPES.DAILY]: 0,
          [FREQUENCY_TYPES.WEEKLY]: 3,
          [FREQUENCY_TYPES.MONTHLY]: 10,
          [FREQUENCY_TYPES.YEARLY]: 30,
          [FREQUENCY_TYPES.ONCE]: -10,
        };
        return DEFAULTS[this.frequency];
      },
    },
    reminderFrequency: {
      type: [{ dayDiff: Number, time: String }],
      default: [],
    },
    leniency: { type: Number, default: 0 },
    isComplete: { type: Boolean, default: false },
    isAvailOnVacation: { type: Boolean, default: false },
    hasImage: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(COLLECTION_NAMES.QUEST, questSchema);
