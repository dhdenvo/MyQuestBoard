const format = require("date-fns/format");
const {
  generateConversationResponse,
  generateSingleResponse,
} = require("../../shared/helpers/aiHelper");
const questCreationExamples = require("./questCreationExamples");
const { QUEST } = require("../../shared/helpers/alternateModels");
const addDays = require("date-fns/addDays");

const createQuestStr = (content) => {
  const currDate = format(new Date(), "yyyy-MM-dd");
  const tomDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const context = [
    "All generated messages should be a json representing a quest with the following fields. " +
      `The current date is ${currDate} for reference. ` +
      '"title" is required and should be a short summary of what the quest is about. ' +
      '"description" is required and should describe what the quest is about in more detail. ' +
      '"rankPoints" should be an integer value describing the worth of the quest, if its missing set to 10. ' +
      '"isSecret" is true if the user says its a secret quest and false if not. ' +
      '"frequency" describes how often the quest repeats. ' +
      'If the quest is a one time quest, set it to "once". ' +
      "If the quest repeats daily, weekly, monthly, or yearly, set frequency to them. " +
      'If the quest repeats on weekdays set frequency to "weekday". ' +
      'If the quest repeats on weekends set frequency to "weekends". ' +
      '"dueDate" is required, is when the quest should be completed on, and should just be a date in format "YYYY-MM-DD". ' +
      '"endDate" is optional, is when the quest should be stop repeating, and should just be a date in format "YYYY-MM-DD". ' +
      `By default, set "dueDate" to ${tomDate} unless specified. ` +
      '"isAvailOnVacation" is false if the user says it shouldn\'t appear on vacation and true if not. ' +
      "If the user doesn't specify vacation, use discretion on whether or not it should be true or false. " +
      '"reminderFrequency" is an array of when the system should remind the user of the quest. ' +
      '"reminderFrequency" should always have at least one element. ' +
      'Elements in the "reminderFrequency" are objects with two fields, "dayDiff" and "time". ' +
      '"dayDiff" is the difference between the current day and the quest\'s "dueDate". ' +
      'So 0 would be a reminder on the quest\'s "dueDate", -1 would be a reminder one day before, ' +
      "1 would be a reminder on the day after, and -2 would be a reminder two days before, etc. " +
      '"time" is the time that the user is reminded of the quest. ' +
      '"time" is in the format "HH-MM", HH is the hour in 24 hour format and MM is the minute of the reminder. ' +
      'If the reminder time is when the user wakes up, set "time" to "awake". ' +
      'If the reminder time is when the user goes to sleep, set "time" to "asleep". ',
  ];
  // Add all examples of quest creation
  const conversation = questCreationExamples().map((str, i) => ({
    content: JSON.stringify(str),
    role: i ? "user" : "assistant",
  }));
  conversation.push({ content, role: "user" });
  return generateConversationResponse(context, conversation);
};

const createQuest = async (adv, msg) => {
  const questStr = await createQuestStr(msg.content);
  const quest = JSON.parse(questStr);
  quest.adventurer = adv._id;
  await QUEST.createOne(quest);
};

module.exports = (adv, msg, genMsg) => createQuest(adv, msg).then(() => genMsg);
