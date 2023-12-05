const alternateModels = require("../../shared/helpers/alternateModels");

module.exports = (adventurer) =>
  alternateModels.ADVENTURER.updateMany(
    { _id: adventurer._id },
    { $set: { aiConversation: [] } }
  );
