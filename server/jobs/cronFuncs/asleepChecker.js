const { getStatus } = require("../../features/discord/discordModel");
const alternateModels = require("../../features/shared/helpers/alternateModels");
const { SLEEP_STATUSES } = require("../cronConfig");

module.exports = async (checkAsleep = true) => {
  // Define the below pipeline's sleep range
  let asleepCheck = {
    $and: [
      { $lte: ["$sleepInfo.start", "$currTime"] },
      { $gte: ["$sleepInfo.end", "$currTime"] },
    ],
  };
  // Invert it if checking for awake
  if (!checkAsleep) asleepCheck = { $not: asleepCheck };
  // Pull all adventurers who qualify for the sleep check
  const adventurers = await alternateModels.ADVENTURER.aggregate([
    { $project: { discordId: 1, sleepInfo: 1, timeZone: 1 } },
    {
      $addFields: {
        currTime: {
          $dateToString: {
            date: new Date(),
            format: "%H:%M",
            timezone: "$timeZone.current",
          },
        },
      },
    },
    { $match: { "sleepInfo.isAsleep": !checkAsleep, $expr: asleepCheck } },
  ]);
  if (!adventurers.length) return;

  const statusProms = adventurers.map(async (adventurer) => {
    const status = await getStatus(adventurer);
    const validStatuses = checkAsleep
      ? SLEEP_STATUSES.ASLEEP
      : SLEEP_STATUSES.AWAKE;
    return [adventurer._id, validStatuses.includes(status)];
  });
  const statuses = await Promise.all(statusProms);
  const changeInStatus = statuses.filter(([_, val]) => val);
  if (!changeInStatus.length) return;

  alternateModels.ADVENTURER.updateMany(
    { _id: { $in: changeInStatus.map(([id]) => id) } },
    { $set: { "sleepInfo.isAsleep": checkAsleep } }
  );
  // Run quest reminders that are for after they wake up or fall asleep
};
