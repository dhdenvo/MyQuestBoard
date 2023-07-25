const { COLLECTION_NAMES } = require("../../../global/config.json");
const ModelTemplate = require("../ModelTemplate");

module.exports = Object.fromEntries(
  Object.entries(COLLECTION_NAMES).map(([key, name]) => [
    key,
    new ModelTemplate(name),
  ])
);
