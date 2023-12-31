const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const completionSchema = Schema(
  {
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
    rankPoints: { type: Number, required: true },
    isFailure: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(
  COLLECTION_NAMES.COMPLETION,
  completionSchema
);
