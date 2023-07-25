const model = require("./completionModel");
const alternateModels = require("../shared/helpers/alternateModels");

const completeQuest = async ({ adventurer, params }) => {
  const quest = await alternateModels.QUEST.findOne(params.id, true);
  if (!quest) throw "Quest is not listed on the quest board";
  return await model.createOne({
    adventurer: adventurer._id,
    quest: quest._id,
  });
};

module.exports = {
  completeQuest,
};
