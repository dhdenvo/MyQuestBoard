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
  )}. Make the message approximately 2 sentences and try to include emojis.`;

  let message = await generateSingleResponse(
    generationMessage,
    quest.adventurer.aiContext
  );
  // Add an invisible character with a link to the quest
  message += `[⠀](${process.env.GUILD_ADDRESS}/quest/${quest._id})`;

  // Send discord message of quest to complete
  const messageProm = sendMessage(quest.adventurer, message);

  // Generate an emoji to react to the message on
  const emojiMessage =
    `Generate a single emoji for "${quest.title}".` +
    "Do not include anything else in the message";
  const emojiProm = await generateSingleResponse(emojiMessage);

  // Send the message and generate the emoji
  const [sentMessage, emoji] = await Promise.all([messageProm, emojiProm]);
  await sentMessage.react(emoji);
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
  for (quest of reminderQuests) await sendReminder(quest);
};
