const model = require("./completionModel");
const alternateModels = require("../shared/helpers/alternateModels");
const extendQuest = require("../shared/helpers/questExtensionHelper");

// Create a completion for a given quest & increase the quest's due date
const completeQuest = async ({ adventurer, params }) => {
  const quest = await alternateModels.QUEST.findOne(params.questId, true);
  if (!quest) throw "Quest is not listed on the quest board";
  // Create the new completion of the quest
  const creationProm = model.createOne({
    adventurer: adventurer._id,
    quest: quest._id,
    rankPoints: quest.rankPoints,
  });
  const proms = [creationProm];

  // Increase the adventurer's rank points by rank points from quest
  proms.push(
    alternateModels.ADVENTURER.updateOne(
      { _id: adventurer },
      { $inc: { rankPoints: quest.rankPoints } }
    )
  );
  // Extend the quest if it is set to be extended
  proms.push(extendQuest(quest));

  const [creationRes] = await Promise.all(proms);
  return creationRes;
};

// Get an overall summary for a given adventurer & query
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

  return model.aggregate(pipeline, !query.dateGrouping);
};

module.exports = {
  completeQuest,
  getCompletionSummary,
};
