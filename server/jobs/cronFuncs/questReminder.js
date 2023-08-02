const alternateModels = require("../../features/shared/helpers/alternateModels");
const { format } = require("date-fns");

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
  });
  if (!reminderQuests.length) return;

  // Send discord message of quest to complete
};
