const alternateModels = require("../../features/shared/helpers/alternateModels");

module.exports = () =>
  alternateModels.ADVENTURER.updateMany(
    { "timeZone.resetCurrentOn": { $lt: new Date() } },
    [
      {
        $set: {
          "timeZone.current": "$timeZone.base",
          "timeZone.resetCurrentOn": null,
        },
      },
    ]
  );
