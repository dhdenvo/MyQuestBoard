const alternateModels = require("../../features/shared/helpers/alternateModels");
const {
  sendMessage,
  checkReaction,
} = require("../../features/discord/discordModel");
const {
  generateSingleResponse,
} = require("../../features/shared/helpers/aiHelper");
const { COLLECTION_NAMES } = require("../cronConfig");

const generateQuestEmoji = async (quest, emojis, ignores) => {
  const adventurer = quest.adventurer;
  const fullDescription = `${quest.title} (${quest.description})`;
  // Generate an emoji to react to the message on
  let emojiMessage =
    `Generate three unique Standard Unicode emoji related to ${fullDescription} (${adventurer.aiContext}). ` +
    "Separate them by new lines (\n) and do not include anything else in the message.";
  // Make sure there are no duplicate emojis between calls
  if (ignores)
    emojiMessage += "\nDo not give the following emojis:" + ignores.join(", ");
  let genEmojis = await generateSingleResponse(emojiMessage);
  // Extract the emojis from each line, removing all non emojis
  genEmojis = genEmojis
    .split("\n")
    .map((txt) => [...txt.replace(/\P{Extended_Pictographic}/u, "")].pop(-1));

  // Loop through emojis until there is a valid one
  for (const genEmoji of genEmojis) {
    if (emojis.includes(genEmoji)) continue;
    await new Promise((resolve) => setTimeout(resolve, 200));
    const isValid = await checkReaction(genEmoji);
    if (isValid) {
      emojis.push(genEmoji);
      return emojis;
    }
  }
  // In case the set didn't have any valid emojis
  return generateQuestEmoji(quest, emojis, genEmojis);
};

const sendReminder = async (quests, msgAlteration) => {
  const adventurer = quests[0].adventurer;

  const emojis = [];
  for (const quest of quests) await generateQuestEmoji(quest, emojis);

  // Generate a custom message for the reminder
  let generationMessage = "Generate a message reminding me on ";
  if (quests.length === 1)
    generationMessage += `${quests[0].title}, it is about ${quests[0].description}. `;
  else
    generationMessage += `${quests.length} things. The reminders are on ${quests
      .map(({ title, description }) => `${title} (about ${description})`)
      .join(", ")}. `;
  generationMessage +=
    "Make the message approximately 2 sentences and include emojis in the message, but do not end the message with emojis.";
  // Update the generation message configuration if a msg alteration is passed
  if (msgAlteration) generationMessage += " " + msgAlteration;

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    await sentMessage.react(emoji);
  }
};

module.exports = async (query = {}) => {
  const { specialTime, msgAlteration, ...dbQuery } = query;
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
  for (quest of Object.values(groupedQuests))
    await sendReminder(quest, msgAlteration);
};
