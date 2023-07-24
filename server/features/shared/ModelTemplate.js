const { model } = require("mongoose");
class ModelTemplate {
  constructor(schema, collectionName) {
    this.model = model(collectionName, schema, collectionName);
  }
}

module.exports = ModelTemplate;
