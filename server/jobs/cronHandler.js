const { CronJob } = require("cron");

const CRONS = [
  {
    func: require("./cronFuncs/questFailure"),
    runtime: "0 50 23 * * *",
  },
  { func: require("./cronFuncs/questReminder"), runtime: "0 * * * * *" },
  { func: require("./cronFuncs/imageCreator"), runtime: "0 0 * * * *" },
];

CRONS.map(({ func, runtime }) => {
  if (!runtime) return;
  new CronJob(runtime, func, null, true, "America/Toronto");
});
