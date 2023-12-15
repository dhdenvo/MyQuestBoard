const { FREQUENCY_TYPES } = require("../configs/questConfig.json");
const alternateModels = require("./alternateModels");
const { isWeekend, set } = require("date-fns");

// Auto increase a date until it passes the current date
const autoIncFunc = (func, date, condFunc = () => true) => {
  const newDate = func(date, 1);
  if (
    newDate >
      set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }) &&
    condFunc(newDate)
  )
    return newDate;
  return autoIncFunc(func, newDate, condFunc);
};
// Specific changes to a quest when the quest is completed
const questExtensionChanges = ({ frequency, dueDate, endDate }, isFailure) => {
  const changes = {
    [FREQUENCY_TYPES.DAILY]: { dueDate: require("date-fns").addDays },
    [FREQUENCY_TYPES.WEEKLY]: { dueDate: require("date-fns").addWeeks },
    [FREQUENCY_TYPES.MONTHLY]: { dueDate: require("date-fns").addMonths },
    [FREQUENCY_TYPES.YEARLY]: { dueDate: require("date-fns").addYears },
    [FREQUENCY_TYPES.ONCE]: isFailure
      ? { dueDate: require("date-fns").addDays }
      : { isComplete: true },
    [FREQUENCY_TYPES.WEEKEND]: {
      dueDate: require("date-fns").addDays,
      condFunc: isWeekend,
    },
    [FREQUENCY_TYPES.WEEKDAY]: {
      dueDate: require("date-fns").addDays,
      condFunc: (date) => !isWeekend(date),
    },
  };
  let change = changes[frequency];
  // If the frequency is a number, increase by that number of days
  if (!change && !isNaN(parseInt(frequency)))
    change = {
      dueDate: (date) => require("date-fns").addDays(date, parseInt(frequency)),
    };
  // If increasing the due date, ensure the new due date is after now
  if (change?.dueDate) {
    change.dueDate = autoIncFunc(change.dueDate, dueDate, change.condFunc);
    // If the new due date is after the end date, don't update the due date & complete quest
    if (endDate && change.dueDate >= endDate) {
      delete change.dueDate;
      change.isComplete = true;
    }
  }
  return change;
};

module.exports = async (quest, isFailure = false) => {
  const questChanges = questExtensionChanges(quest, isFailure);
  // If there is an increase function, update the quest with the new due date
  if (!questChanges) return;
  return await alternateModels.QUEST.updateOne(
    { _id: quest._id },
    { $set: questChanges }
  );
};
