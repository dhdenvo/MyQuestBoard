const { model } = require("mongoose");
class ModelTemplate {
  constructor(schema, collectionName) {
    this.dbModel = model(collectionName, schema, collectionName);
  }

  findMany = (query = {}) => this.dbModel.find(query);
  createOne = (doc) => this.dbModel.create(doc);
  updateOne = (query, updateDoc) => this.dbModel.updateOne(query, updateDoc);
}

module.exports = ModelTemplate;
