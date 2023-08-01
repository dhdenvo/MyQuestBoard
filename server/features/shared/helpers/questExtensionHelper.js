const { FREQUENCY_TYPES } = require("../configs/questConfig.json");
const alternateModels = require("./alternateModels");

// Auto increase a date until it passes the current date
const autoIncFunc = (func, date) => {
  const newDate = func(date, 1);
  if (newDate > new Date()) return newDate;
  return autoIncFunc(func, newDate);
};
// Specific changes to a quest when the quest is completed
const questCompletionChanges = ({ frequency, dueDate }, isFailure) => {
  const changes = {
    [FREQUENCY_TYPES.DAILY]: { dueDate: require("date-fns").addDays },
    [FREQUENCY_TYPES.WEEKLY]: { dueDate: require("date-fns").addWeeks },
    [FREQUENCY_TYPES.MONTHLY]: { dueDate: require("date-fns").addMonths },
    [FREQUENCY_TYPES.YEARLY]: { dueDate: require("date-fns").addYears },
    [FREQUENCY_TYPES.ONCE]: isFailure
      ? { dueDate: require("date-fns").addWeeks }
      : { isComplete: true },
  };
  const change = changes[frequency];
  if (change?.dueDate) change.dueDate = autoIncFunc(change.dueDate, dueDate);
  return change;
};

module.exports = async (quest, isFailure = false) => {
  const questChanges = questCompletionChanges(quest, isFailure);
  // If there is an increase function, update the quest with the new due date
  if (!questChanges) return;
  return await alternateModels.QUEST.updateOne(
    { _id: quest._id },
    { $set: questChanges }
  );
};
