const model = require("./questModel");
const { COLLECTION_NAMES } = require("../../global/config.json");
const { getDayOfYear, getYear } = require("date-fns");

const getQuests = ({ adventurer }) => {
  const completionQuery = [
    { $eq: ["$quest", "$$id"] },
    { $eq: ["$adventurer", adventurer._id] },
    { $eq: [{ $year: "$completedOn" }, getYear(new Date())] },
    { $eq: [{ $dayOfYear: "$completedOn" }, getDayOfYear(new Date())] },
  ];
  const pipeline = [
    // Get all of an adventurer's quests
    { $match: { adventurer: adventurer._id } },
    // Get the player's completion for a given quest for a current day
    {
      $lookup: {
        from: COLLECTION_NAMES.COMPLETION,
        let: { id: "$_id" },
        pipeline: [{ $match: { $expr: { $and: completionQuery } } }],
        as: "isComplete",
      },
    },
    // Convert the completion into a boolean if completed or not
    { $addFields: { isComplete: { $ne: ["$isComplete", []] } } },
  ];
  return model.aggregate(pipeline, false);
};

module.exports = {
  getQuests,
};
