const { Schema } = require("mongoose");
const ModelTemplate = require("../shared/ModelTemplate");

const adventurerSchema = Schema({
  name: { type: String, require: true },
  rankPoints: { type: Number, default: 0 },
  rank: { type: String },
});

const adventurerModel = new ModelTemplate(adventurerSchema);

module.exports = adventurerModel;
