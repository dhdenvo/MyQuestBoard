const model = require("./completionModel");
const alternateModels = require("../shared/helpers/alternateModels");
const { FREQUENCY_TYPES } = require("../shared/configs/questConfig.json");

// Auto increase a date until it passes the current date
const autoIncFunc = (func, date) => {
  const newDate = func(date, 1);
  if (newDate > new Date()) return newDate;
  return autoIncFunc(func, newDate);
};
// Specific changes to a quest when the quest is completed
const questCompletionChanges = ({ frequency, dueDate }) => {
  const changes = {
    [FREQUENCY_TYPES.DAILY]: { dueDate: require("date-fns").addDays },
    [FREQUENCY_TYPES.WEEKLY]: { dueDate: require("date-fns").addWeeks },
    [FREQUENCY_TYPES.MONTHLY]: { dueDate: require("date-fns").addMonths },
    [FREQUENCY_TYPES.YEARLY]: { dueDate: require("date-fns").addYears },
    [FREQUENCY_TYPES.ONCE]: { isComplete: true },
  };
  const change = changes[frequency];
  if (change?.dueDate) change.dueDate = autoIncFunc(change.dueDate, dueDate);
  return change;
};

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
  await alternateModels.ADVENTURER.updateOne(
    { _id: adventurer },
    { $inc: { rankPoints: quest.rankPoints } }
  );

  // Get the increase function for the due date
  const questChanges = questCompletionChanges(quest);
  // If there is an increase function, update the quest with the new due date
  if (questChanges)
    proms.push(
      alternateModels.QUEST.updateOne(
        { _id: quest._id },
        { $set: questChanges }
      )
    );

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
