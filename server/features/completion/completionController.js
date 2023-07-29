const model = require("./completionModel");
const alternateModels = require("../shared/helpers/alternateModels");
const { FREQUENCY_TYPES } = require("../shared/configs/questConfig.json");

// Specific functions that increase the due date by the frequencies
const FREQUENCY_INCREASE_FUNCS = {
  [FREQUENCY_TYPES.DAILY]: require("date-fns").addDays,
  [FREQUENCY_TYPES.WEEKLY]: require("date-fns").addWeeks,
  [FREQUENCY_TYPES.MONTHLY]: require("date-fns").addMonths,
  [FREQUENCY_TYPES.YEARLY]: require("date-fns").addYears,
};
// Auto increase a date until it passes the current date
const autoIncFunc = (func, date) => {
  const newDate = func(date, 1);
  if (newDate > new Date()) return newDate;
  return autoIncFunc(func, newDate);
};

// Create a completion for a given quest & increase the quest's due date
const completeQuest = async ({ adventurer, params }) => {
  const quest = await alternateModels.QUEST.findOne(params.questId, true);
  if (!quest) throw "Quest is not listed on the quest board";
  // Create the new completion of the quest
  const creationProm = model.createOne({
    adventurer: adventurer._id,
    quest: quest._id,
  });
  const proms = [creationProm];

  // Get the increase function for the due date
  const freqIncFunc = FREQUENCY_INCREASE_FUNCS[quest.frequency];
  // If there is an increase function, update the quest with the new due date
  if (freqIncFunc)
    proms.push(
      alternateModels.QUEST.updateOne(
        { _id: quest._id },
        { $set: { dueDate: autoIncFunc(freqIncFunc, quest.dueDate) } }
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
