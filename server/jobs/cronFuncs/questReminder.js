const alternateModels = require("../../features/shared/helpers/alternateModels");
const { format } = require("date-fns");
const { sendMessage } = require("../../features/discord/discordModel");
const {
  generateSingleResponse,
} = require("../../features/shared/helpers/aiHelper");

const sendReminder = async (quest) => {
  const formatDate = (date) => format(date, "MMM d, yyy");
  const generationMessage = `Generating a message reminding me on "${
    quest.title
  }". It is about ${quest.description}. This is due on ${formatDate(
    quest.dueDate
  )} and it is currently ${formatDate(
    new Date()
  )}. Make the message approximately 2 sentences.`;
  const message = await generateSingleResponse(generationMessage);

  // Send discord message of quest to complete
  return await sendMessage(quest.adventurer, message);
};

module.exports = async () => {
  const time = format(new Date(), "HH:mm", {
    timeZone: "America/Toronto",
  });
  const date = format(new Date(), "yyyy-DDDD");

  // Get all quests that are to be reminded on
  const reminderQuests = await alternateModels.QUEST.findMany({
    isComplete: false,
    $expr: {
      $in: [
        true,
        {
          $map: {
            input: "$reminderFrequency",
            as: "remind",
            in: {
              $and: [
                { $eq: [time, "$$remind.time"] },
                {
                  $eq: [
                    date,
                    {
                      $dateToString: {
                        date: {
                          $dateAdd: {
                            startDate: "$dueDate",
                            unit: "day",
                            amount: "$$remind.dayDiff",
                          },
                        },
                        format: "%Y-0%j",
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  }).populate("adventurer");
  if (!reminderQuests.length) return;

  // Send reminders for every quest that needs reminding
  return await Promise.all(reminderQuests.map(sendReminder));
};
