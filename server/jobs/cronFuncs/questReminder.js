const alternateModels = require("../../features/shared/helpers/alternateModels");
const { format } = require("date-fns");
const { sendMessage } = require("../../features/discord/discordModel");

const sendReminder = (quest) => {
  const message =
    `Hey, just a heads up - remember to do the quest "[${quest.title}](${process.env.GUILD_ADDRESS})"` +
    `. Its due on ${quest.dueDate}, so make sure to do it`;

  // Send discord message of quest to complete
  return sendMessage(quest.adventurer, message);
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
