const alternateModels = require("../../features/shared/helpers/alternateModels");

module.exports = async () => {
  // Get all quests that have been failed
  const failedQuests = await alternateModels.QUEST.findMany({
    isComplete: false,
    $expr: {
      $lte: [
        {
          $dateAdd: {
            startDate: "$dueDate",
            unit: "day",
            amount: { $add: ["$leniency", 1] },
          },
        },
        new Date(),
      ],
    },
  });
  if (!failedQuests.length) return;

  // Create a completion for every quest failed
  await alternateModels.COMPLETION.createMany(
    failedQuests.map((quest) => ({
      adventurer: quest.adventurer,
      quest: quest._id,
      rankPoints: quest.rankPoints,
      isFailure: true,
    }))
  );

  // For every adventurer, reduce their rank points based on the rank points they failed
  const adventurerProms = Object.entries(
    failedQuests.reduce(
      (obj, quest) => ({
        ...obj,
        [quest.adventurer]: (obj[quest.adventurer] || 0) + quest.rankPoints,
      }),
      {}
    )
  ).map(([adventurer, lostAmount]) =>
    alternateModels.ADVENTURER.updateOne(
      { _id: adventurer },
      { $inc: { rankPoints: -lostAmount } }
    )
  );
  await Promise.all(adventurerProms);
};
