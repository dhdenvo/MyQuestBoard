const model = require("./completionModel");
const alternateModels = require("../shared/helpers/alternateModels");

const completeQuest = async ({ adventurer, params }) => {
  const quest = await alternateModels.QUEST.findOne(params.questId, true);
  if (!quest) throw "Quest is not listed on the quest board";
  return await model.createOne({
    adventurer: adventurer._id,
    quest: quest._id,
  });
};

const getCompletionSummary = ({ adventurer, query }) => {
  const match = { adventurer: adventurer._id };
  // If a specific quest is passed, only show completions for that quest
  if (query.questId) match.quest = ObjectId(params.questId);
  const pipeline = [{ $match: match }];
  // If a specific type of grouping is passed, group the completions by the date
  if (query.dateGrouping)
    pipeline.push({
      $group: {
        _id: { [`$${query.dateGrouping}`]: "$completedOn" },
        completionAmount: { $sum: 1 },
      },
    });

  return model.aggregate(pipeline);
};

module.exports = {
  completeQuest,
  getCompletionSummary,
};
