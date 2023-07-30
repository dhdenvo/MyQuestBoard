const { CronJob } = require("cron");

const CRONS = [
  { func: require("./cronFuncs/questFailure"), runtime: null },
  { func: require("./cronFuncs/questReminder"), runtime: null },
];

CRONS.map(({ func, runtime }) => {
  if (!runtime) return;
  new CronJob(runtime, func, null, true);
});
