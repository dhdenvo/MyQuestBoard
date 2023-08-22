const model = require("./questModel");
const { COLLECTION_NAMES } = require("../../global/config.json");

// Get all quests for an adventurer with their completion
const getQuests = ({ adventurer }) => {
  // Create the query for what counts as a valid completion for a quest
  const completionQuery = [
    { $eq: ["$quest", "$$id"] },
    { $eq: ["$adventurer", adventurer._id] },
  ];
  const pipeline = [
    // Get all of an adventurer's quests
    { $match: { adventurer: adventurer._id, isComplete: false } },
    // Get the player's completion for a given quest for a current day
    {
      $lookup: {
        from: COLLECTION_NAMES.COMPLETION,
        let: { id: "$_id", dueDate: "$dueDate", validUntil: "$validUntil" },
        pipeline: [
          { $match: { $expr: { $and: completionQuery } } },
          { $sort: { completedOn: -1 } },
        ],
        as: "isComplete",
      },
    },
    // Convert the completion into a boolean if completed or not
    {
      $addFields: {
        isComplete: {
          $and: [
            // Ensure there is at least one completion
            { $ne: ["$isComplete", []] },
            // Ensure the last completion is a pass
            {
              $eq: [
                {
                  $getField: {
                    field: "isFailure",
                    input: { $first: "$isComplete" },
                  },
                },
                false,
              ],
            },
            // Use the due date as a way to figure out if the quest has been completed
            {
              $lt: [
                // Get the current date (ignore time)
                { $dateToString: { date: new Date(), format: "%G-%m-%d" } },
                {
                  $dateToString: {
                    date: {
                      $dateSubtract: {
                        startDate: "$dueDate",
                        unit: "day",
                        amount: "$validUntil",
                      },
                    },
                    // Format the dates into strings to ignore times
                    format: "%G-%m-%d",
                  },
                },
              ],
            },
          ],
        },
      },
    },
    { $sort: { isComplete: 1, dueDate: 1, title: 1 } },
  ];
  return model.aggregate(pipeline);
};

// A simple create quest function from a quest object
const createQuest = (quest) => model.createOne(quest);

module.exports = {
  getQuests,
  createQuest,
};
