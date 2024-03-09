const { CronJob } = require("cron");
const differenceInSeconds = require("date-fns/differenceInSeconds");
const format = require("date-fns/format");

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
  const dateMessage = `${format(
    new Date(),
    "MMMM dd, yyyy h:m a"
  )}: ${message}`;

  switch (process.env.CRON_LOGGING) {
    case "console":
      return console.log(dateMessage);
  }
};

CRONS.forEach(({ path, runtime }) => {
  if (!runtime) return;
  // Use the cron job's file name as the cron's name
  const name = path.slice(path.lastIndexOf("/") + 1);
  // Define a generic function for running all cron jobs
  const func = async () => {
    logCron(`Starting cron job ${name}`);
    const startTime = new Date();
    // Run the cron job (catching errors)
    const res = await require(path)().catch((error) => {
      logCron(`Error in cron job ${name}: ${error}`);
      return { error };
    });
    if (res?.error) return;
    const timeDiff = differenceInSeconds(new Date(), startTime);
    logCron(`Completed cron job ${name} (${timeDiff}s)`);
  };

  // Create the cron job with the generic function
  new CronJob(runtime, func, null, true, "America/Toronto");
});
