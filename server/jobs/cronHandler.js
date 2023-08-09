const { CronJob } = require("cron");

const CRONS = [
  { path: "./cronFuncs/questFailure", runtime: "0 50 23 * * *" },
  { path: "./cronFuncs/questReminder", runtime: "0 * * * * *" },
  { path: "./cronFuncs/imageCreator", runtime: "0 0 * * * *" },
];

CRONS.forEach(({ path, runtime }) => {
  if (!runtime) return;
  // Use the cron job's file name as the cron's name
  const name = path.slice(path.lastIndexOf("/") + 1);
  // Define a generic function for running all cron jobs
  const func = async () => {
    console.log(`Starting cron job ${name}`);
    // Run the cron job (catching errors)
    const res = await require(path)().catch((error) => {
      console.error(`Error in cron job ${name}`);
      return { error };
    });
    if (res?.error) return;
    console.log(`Completed cron job ${name}`);
  };

  // Create the cron job with the generic function
  new CronJob(runtime, func, null, true, "America/Toronto");
});
