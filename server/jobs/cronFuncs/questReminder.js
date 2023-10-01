const alternateModels = require("../../features/shared/helpers/alternateModels");
const { format } = require("date-fns");
const { sendMessage } = require("../../features/discord/discordModel");
const {
  generateSingleResponse,
} = require("../../features/shared/helpers/aiHelper");

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

module.exports = async () => {
  const time = format(new Date(), "HH:mm", {
    timeZone: "America/Toronto",
  });
  const date = format(new Date(), "yyyy-DDDD", {
    timeZone: "America/Toronto",
  });

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

  const groupedQuests = reminderQuests.reduce((g, quest) => {
    (g[quest.adventurer.id] = g[quest.adventurer.id] || []).push(quest);
    return g;
  }, {});
  // Send reminders for every quest that needs reminding
  for (quest of Object.values(groupedQuests)) await sendReminder(quest);
};
