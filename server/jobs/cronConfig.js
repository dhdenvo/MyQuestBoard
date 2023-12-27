const discConfig = require("../features/discord/discordConfig.json");
const questConfig = require("../features/shared/configs/questConfig.json");

module.exports = {
  CLEANER_TIMEOUT: 10,
  SLEEP_STATUSES: {
    ASLEEP: [discConfig.STATUSES.IDLE, discConfig.STATUSES.OFFLINE, undefined],
    AWAKE: [discConfig.STATUSES.DND, discConfig.STATUSES.ONLINE],
  },
  SPECIAL_TIMES: questConfig.SPECIAL_TIMES,
};
