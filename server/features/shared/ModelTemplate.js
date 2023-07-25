const { model } = require("mongoose");
class ModelTemplate {
  constructor(schema, collectionName) {
    this.dbModel = model(collectionName, schema, collectionName);
  }
}

module.exports = ModelTemplate;
