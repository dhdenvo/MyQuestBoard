const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");
const { COLLECTION_NAMES } = require("../../global/config.json");

const questSchema = Schema({
  title: { type: String, required: true },
  isSecret: { type: Boolean, default: false },
  isFound: { type: Boolean, default: false },
});

module.exports = new ModelTemplate(questSchema, COLLECTION_NAMES.SEARCH);
