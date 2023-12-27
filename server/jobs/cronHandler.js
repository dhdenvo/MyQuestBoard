const { CronJob } = require("cron");

const CRONS = [
  { path: "./cronFuncs/questFailure", runtime: "0 59 * * * *" },
  { path: "./cronFuncs/questReminder", runtime: "0 * * * * *" },
  { path: "./cronFuncs/imageCreator", runtime: "0 0 * * * *" },
  { path: "./cronFuncs/updateRank", runtime: "0 */10 * * * *" },
  { path: "./cronFuncs/conversationCleaner", runtime: "0 * * * * *" },
  { path: "./cronFuncs/timeZoneResetter", runtime: "0 */10 * * * *" },
  { path: "./cronFuncs/awakeChecker", runtime: "0 * * * * *" },
  { path: "./cronFuncs/asleepChecker", runtime: "0 * * * * *" },
];

// A system for controlling how cron jobs are logged
const logCron = (message) => {
  switch (process.env.CRON_LOGGING) {
    case "console":
      return console.log(message);
  }
};

CRONS.forEach(({ path, runtime }) => {
  if (!runtime) return;
  // Use the cron job's file name as the cron's name
  const name = path.slice(path.lastIndexOf("/") + 1);
  // Define a generic function for running all cron jobs
  const func = async () => {
    logCron(`Starting cron job ${name}`);
    // Run the cron job (catching errors)
    const res = await require(path)().catch((error) => {
      logCron(`Error in cron job ${name}: ${error}`);
      return { error };
    });
    if (res?.error) return;
    logCron(`Completed cron job ${name}`);
  };

  // Create the cron job with the generic function
  new CronJob(runtime, func, null, true, "America/Toronto");
});
