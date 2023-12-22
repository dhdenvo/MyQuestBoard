const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const conversationSchema = Schema(
  {
    content: { type: String, required: true },
    role: { type: String, required: true },
    sentOn: { type: Date, default: Date.now },
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
    timeZone: {
      current: { type: String, default: "America/Toronto" },
      base: { type: String, default: "America/Toronto" },
      resetCurrentOn: { type: Date, default: null },
    },
  },
  { versionKey: false }
);

module.exports = new ModelTemplate(
  COLLECTION_NAMES.ADVENTURER,
  adventurerSchema
);
