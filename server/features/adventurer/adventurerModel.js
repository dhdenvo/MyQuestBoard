const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const conversationSchema = Schema(
  {
    message: { type: String, required: true },
    saidOn: { type: Date, default: Date.now },
  },
  { versionKey: false, _id: false }
);

const adventurerSchema = Schema(
  {
    name: { type: String, required: true },
    rankPoints: { type: Number, default: 0, min: 0 },
    rank: String,
    discordId: String,
    aiContext: String,
    aiConversation: { type: [conversationSchema], default: [] },
    hasImage: { type: Boolean, default: false },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(
  COLLECTION_NAMES.ADVENTURER,
  adventurerSchema
);
