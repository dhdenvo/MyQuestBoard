const { getStatus } = require("../../features/discord/discordModel");
const alternateModels = require("../../features/shared/helpers/alternateModels");

module.exports = async (checkAsleep = true) => {
  const adventurers = await alternateModels.ADVENTURER.pipeline([
    { $project: { discordId: 1, sleepInfo: 1 } },
    {
      $addFields: {
        currTime: {
          $dateToString: {
            date: new Date(),
            format: "%H:%M",
            timezone: "$adventurer.timeZone.current",
          },
        },
      },
    },
    {
      $match: {
        "sleepInfo.isAsleep": !checkAsleep,
        // Check below logic
        "sleepInfo.start": { [checkAsleep ? "$lt" : "$gt"]: "$currTime" },
        "sleepInfo.end": { [checkAsleep ? "$gt" : "$lt"]: "$currTime" },
      },
    },
  ]);
  if (!adventurers.length) return;

  const statusProms = adventurers.map(async (adventurer) => {
    const status = await getStatus(adventurer);
    if (!status) return;
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
