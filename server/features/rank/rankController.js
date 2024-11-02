const model = require("./rankModel");

const getRanks = (query = {}) => model.findMany(query);

module.exports = {
  getRanks,
};
