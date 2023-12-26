const alternateModels = require("../../features/shared/helpers/alternateModels");
const { sendMessage } = require("../../features/discord/discordModel");
const {
  generateSingleResponse,
} = require("../../features/shared/helpers/aiHelper");
const { COLLECTION_NAMES } = require("../../global/config.json");

const sendReminder = async (quests) => {
  const adventurer = quests[0].adventurer;

  // Generate an emoji to react to the message on
  const emojiMessage =
    `Generate a single unique Standard Unicode emoji for each description (${adventurer.aiContext}). Separate them by new lines (\n) and do not include anything else in the message.\n` +
    quests
      .map(({ title, description }) => `${title} (${description})`)
      .join("\n");
  let emojis = await generateSingleResponse(emojiMessage);
  // Extract the emojis from each line, removing all non emojis
  emojis = emojis
    .split("\n")
    .map((txt) => [...txt.replace(/\P{Extended_Pictographic}/u, "")].pop(-1));

  // Generate a custom message for the reminder
  let generationMessage = "Generate a message reminding me on ";
  if (quests.length === 1)
    generationMessage += `${quests[0].title}, it is about ${quests[0].description}. `;
  else
    generationMessage += `${quests.length} things. The reminders are on ${quests
      .map(({ title, description }) => `${title} (about ${description})`)
      .join(", ")}. `;
  generationMessage +=
    "Make the message approximately 2 sentences and include emojis.";

  let message = await generateSingleResponse(
    generationMessage,
    adventurer.aiContext
  );

  const linkMsg = quests
    .map(({ _id }) => `[⠀](${process.env.GUILD_ADDRESS}/quest/${_id})`)
    .join("");
  message += emojis.reverse().join("") + linkMsg;

  // Send discord message of quest to complete
  const sentMessage = await sendMessage(adventurer, message);
  // Add the emojis
  for (emoji of emojis) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await sentMessage.react(emoji);
  }
};

module.exports = async (query = {}) => {
  const { specialTime, ...dbQuery } = query;
  // Get all quests that are to be reminded on
  const reminderQuests = await alternateModels.QUEST.aggregate([
    { $match: dbQuery },
    {
      $lookup: {
        from: COLLECTION_NAMES.ADVENTURER,
        localField: "adventurer",
        foreignField: "_id",
        as: "adventurer",
      },
    },
    { $unwind: "$adventurer" },
    {
      // Save the current date & time in the adventurer's time zone
      $addFields: {
        currTime: {
          $dateToString: {
            date: new Date(),
            format: "%H:%M",
            timezone: "$adventurer.timeZone.current",
          },
        },
        currDate: {
          $dateToString: {
            date: new Date(),
            format: "%Y-%j",
            timezone: "$adventurer.timeZone.current",
          },
        },
      },
    },
    {
      $match: {
        isComplete: false,
        $expr: {
          // Check if the adventurer is on vacation
          $and: [
            {
              $or: [{ $not: "$adventurer.isOnVacation" }, "$isAvailOnVacation"],
            },
            // Check if the quest's reminder frequency matches the current time
            {
              $in: [
                true,
                {
                  $map: {
                    input: "$reminderFrequency",
                    as: "remind",
                    in: {
                      $and: [
                        { $eq: [specialTime ?? "$currTime", "$$remind.time"] },
                        {
                          $eq: [
                            "$currDate",
                            {
                              $dateToString: {
                                date: {
                                  $dateAdd: {
                                    startDate: "$dueDate",
                                    unit: "day",
                                    amount: "$$remind.dayDiff",
                                  },
                                },
                                format: "%Y-%j",
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
          ],
        },
      },
    },
  ]);
  if (!reminderQuests.length) return;

  const groupedQuests = reminderQuests.reduce((g, quest) => {
    (g[quest.adventurer.id] = g[quest.adventurer.id] || []).push(quest);
    return g;
  }, {});
  // Send reminders for every quest that needs reminding
  for (quest of Object.values(groupedQuests)) await sendReminder(quest);
};
