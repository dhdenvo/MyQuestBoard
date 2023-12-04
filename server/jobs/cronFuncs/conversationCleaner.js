const alternateModels = require("../../features/shared/helpers/alternateModels");
const { subMinutes } = require("date-fns");
const { CLEANER_TIMEOUT } = require("../cronConfig.json");

module.exports = () =>
  alternateModels.ADVENTURER.updateMany(
    { aiConversation: { $ne: { $size: 0 } } },
    {
      $pull: {
        aiConversation: {
          sentOn: { $lt: subMinutes(new Date(), CLEANER_TIMEOUT) },
        },
      },
    }
  );
