const { model } = require("mongoose");
class ModelTemplate {
  constructor(collectionName, schema) {
    this.dbModel = model(collectionName, schema, collectionName);
  }

  findOne = (query = {}, useId = false) =>
    useId ? this.dbModel.findById(query) : this.dbModel.findOne(query);
  findMany = (query = {}) => this.dbModel.find(query);
  createOne = (doc) => this.dbModel.create(doc);
  updateOne = (query, updateDoc) => this.dbModel.updateOne(query, updateDoc);
}

module.exports = ModelTemplate;
