const { model } = require("mongoose");
class ModelTemplate {
  constructor(collectionName, schema) {
    this.schema = schema;
    this.dbModel = model(collectionName, schema, collectionName);
    this.popPath = schema
      ? Object.entries(schema.paths)
          .filter(
            ([path, val]) => val.instance === "ObjectId" && path !== "_id"
          )
          .map(([path]) => path)
          .join(" ")
      : null;
  }

  findOne = (query = {}, useId = false) =>
    useId ? this.dbModel.findById(query) : this.dbModel.findOne(query);
  findMany = (query = {}) => this.dbModel.find(query);
  createOne = (doc) => this.dbModel.create(doc);
  createMany = (docs) => this.dbModel.insertMany(docs);
  updateOne = (query, updateDoc) => this.dbModel.updateOne(query, updateDoc);
  bulkWrite = (operations) => this.dbModel.bulkWrite(operations);

  aggregate = (pipeline = [], autoPopulate = false) => {
    const agg = this.dbModel.aggregate(pipeline);
    if (!autoPopulate || !this.popPath) return agg;
    return agg.then((docs) =>
      this.dbModel.populate(docs, { path: this.popPath })
    );
  };
}

module.exports = ModelTemplate;
