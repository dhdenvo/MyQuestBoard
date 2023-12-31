const { getStatus } = require("../../features/discord/discordModel");
const alternateModels = require("../../features/shared/helpers/alternateModels");
const { SLEEP_STATUSES, SPECIAL_TIMES } = require("../cronConfig");
const questReminder = require("./questReminder");

module.exports = async (checkAsleep = true) => {
  // Define the below pipeline's sleep range
  const rangeArr = [
    { $lte: ["$sleepInfo.start", "$currTime"] },
    { $gte: ["$sleepInfo.end", "$currTime"] },
  ];
  let asleepCheck = {
    $cond: {
      if: { $lt: ["$sleepInfo.start", "$sleepInfo.end"] },
      then: { $and: rangeArr },
      else: { $or: rangeArr },
    },
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

  // Pull the adventurer's discord status and decide if they are awake or asleep based on it
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

  // Update the adventurer's sleep info
  await alternateModels.ADVENTURER.updateMany(
    { _id: { $in: changeInStatus.map(([id]) => id) } },
    { $set: { "sleepInfo.isAsleep": checkAsleep } }
  );

  // Send the reminder for all quests for the changed status adventurers
  await questReminder({
    adventurer: { $in: changeInStatus.map(([id]) => id) },
    specialTime: checkAsleep ? SPECIAL_TIMES.ASLEEP : SPECIAL_TIMES.AWAKE,
  });
};
