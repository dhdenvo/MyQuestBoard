const alternateModels = require("../../features/shared/helpers/alternateModels");
const extendQuest = require("../../features/shared/helpers/questExtensionHelper");
const { COLLECTION_NAMES } = require("../../global/config.json");

module.exports = async () => {
  // Get all quests that have been failed
  const allFailedQuests = await alternateModels.QUEST.aggregate([
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
      $match: {
        isComplete: false,
        $expr: {
          $lte: [
            {
              $concat: [
                {
                  $dateToString: {
                    date: {
                      $dateAdd: {
                        startDate: "$dueDate",
                        unit: "day",
                        amount: "$leniency",
                      },
                    },
                    format: "%Y-%j",
                  },
                },
                " 23:59",
              ],
            },
            {
              $dateToString: {
                date: new Date(),
                format: "%Y-%j %H:%M",
                timezone: "$adventurer.timeZone.current",
              },
            },
          ],
        },
      },
    },
  ]);
  if (!allFailedQuests.length) return;
  // Don't create a completion or update the adventurer if on vacation
  const failedQuests = allFailedQuests.filter(
    (quest) => !quest.adventurer.isOnVacation || quest.isAvailOnVacation
  );

  // Create a completion for every quest failed
  await alternateModels.COMPLETION.createMany(
    failedQuests.map((quest) => ({
      adventurer: quest.adventurer._id,
      quest: quest._id,
      rankPoints: -quest.rankPoints,
      isFailure: true,
    }))
  );
  // For every adventurer, reduce their rank points based on the rank points they failed
  const adventurerProms = Object.entries(
    failedQuests.reduce(
      (obj, quest) => ({
        ...obj,
        [quest.adventurer._id]:
          (obj[quest.adventurer._id] || 0) + quest.rankPoints,
      }),
      {}
    )
  ).map(([adventurer, lostAmount]) =>
    alternateModels.ADVENTURER.updateOne(
      { _id: adventurer._id, rankPoints: { $gte: lostAmount } },
      { $inc: { rankPoints: -lostAmount } }
    )
  );
  await Promise.all(adventurerProms);
  // For every quest failed, extend the due date
  await Promise.all(allFailedQuests.map((quest) => extendQuest(quest, true)));
};
