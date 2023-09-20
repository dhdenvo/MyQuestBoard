const { FREQUENCY_TYPES } = require("../configs/questConfig.json");
const alternateModels = require("./alternateModels");
const { differenceInDays } = require("date-fns");

// Auto increase a date until it passes the current date
const autoIncFunc = (func, date) => {
  const newDate = func(date, 1);
  if (
    differenceInDays(newDate, new Date(0)) >=
    differenceInDays(new Date(), new Date(0))
  )
    return newDate;
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
  let change = changes[frequency];
  // If the frequency is a number, increase by that number of days
  if (!change && !isNaN(parseInt(frequency)))
    change = {
      dueDate: (date) => require("date-fns").addDays(date, parseInt(frequency)),
    };
  // If increasing the due date, ensure the new due date is after now
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
