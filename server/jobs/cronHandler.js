const { CronJob } = require("cron");

const CRONS = [
  {
    func: require("./cronFuncs/questFailure"),
    runtime: "0 50 23 * * *",
  },
  { func: require("./cronFuncs/questReminder"), runtime: null },
];

CRONS.map(({ func, runtime }) => {
  if (!runtime) return;
  new CronJob(runtime, func, null, true, "America/Toronto");
});
