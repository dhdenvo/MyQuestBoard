const model = require("./adventurerModel");

const getAdventurers = () => model.findMany();
const createAdventurer = ({ body }) => model.createOne(body);

module.exports = {
  getAdventurers,
  createAdventurer,
};
