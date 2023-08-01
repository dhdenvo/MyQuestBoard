const alternateModels = require("../../features/shared/helpers/alternateModels");

module.exports = async () => {
  // Get all quests that have been failed
  const failedQuests = await alternateModels.QUEST.findMany({
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

  // Create a completion for every quest failed
  await alternateModels.COMPLETION.createMany(
    failedQuests.map((quest) => ({
      quest: quest._id,
      adventurer: quest.adventurer,
      isFailure: true,
    }))
  );

  // For every adventurer, reduce their rank points based on the rank points they failed
  const adventurerProms = Object.entries(
    failedQuests.reduce(
      (obj, quest) => ({
        ...obj,
        [quest.adventurer]: [...(obj[quest.adventurer] || []), quest],
      }),
      {}
    )
  ).map(([adventurer, quests]) => {
    const lostAmount = quests.reduce((s, { rankPoints }) => s + rankPoints, 0);
    return alternateModels.ADVENTURER.updateOne(
      { _id: adventurer },
      { $inc: { rankPoints: -lostAmount } }
    );
  });
  await Promise.all(adventurerProms);
};
