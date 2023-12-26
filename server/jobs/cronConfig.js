const discConfig = require("../features/discord/discordConfig.json");

module.exports = {
  CLEANER_TIMEOUT: 10,
  SLEEP_STATUSES: {
    ASLEEP: [discConfig.STATUSES.IDLE, discConfig.STATUSES.OFFLINE],
    AWAKE: [discConfig.STATUSES.DND, discConfig.STATUSES.ONLINE],
  },
};
