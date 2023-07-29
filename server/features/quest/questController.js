const model = require("./questModel");
const { COLLECTION_NAMES } = require("../../global/config.json");

// Get all quests for an adventurer with their completion
const getQuests = ({ adventurer }) => {
  // Create the query for what counts as a valid completion for a quest
  const completionQuery = [
    { $eq: ["$quest", "$$id"] },
    { $eq: ["$adventurer", adventurer._id] },
    {
      $lt: [
        "$completedOn",
        {
          $dateSubtract: {
            startDate: "$$dueDate",
            unit: "day",
            amount: "$$validUntil",
          },
        },
      ],
    },
  ];
  const pipeline = [
    // Get all of an adventurer's quests
    { $match: { adventurer: adventurer._id } },
    // Get the player's completion for a given quest for a current day
    {
      $lookup: {
        from: COLLECTION_NAMES.COMPLETION,
        let: { id: "$_id", dueDate: "$dueDate", validUntil: "$validUntil" },
        pipeline: [{ $match: { $expr: { $and: completionQuery } } }],
        as: "isComplete",
      },
    },
    // Convert the completion into a boolean if completed or not
    { $addFields: { isComplete: { $ne: ["$isComplete", []] } } },
  ];
  return model.aggregate(pipeline, false);
};

// A simple create quest function from a quest object
const createQuest = (quest) => model.createOne(quest);

module.exports = {
  getQuests,
  createQuest,
};
