const format = require("date-fns/format");
const addDays = require("date-fns/addDays");
const addYears = require("date-fns/addYears");

module.exports = () => [
  "Create a quest for brushing my teeth that repeats daily and reminds me when I wake up.",
  JSON.stringify({
    title: "Brush teeth",
    description: "Go brush your teeth",
    rankPoints: 10,
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    frequency: "daily",
    isSecret: false,
    isAvailOnVacation: true,
    reminderFrequency: [{ dayDiff: 0, time: "awake" }],
  }),
  "Create a quest for shovelling the snow on the driveway at noon for the next three days",
  JSON.stringify({
    title: "Shovel snow",
    description: "Shovel all the snow on the driveway",
    rankPoints: 10,
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 4), "yyyy-MM-dd"),
    frequency: "daily",
    isSecret: false,
    isAvailOnVacation: true,
    reminderFrequency: [{ dayDiff: 0, time: "12:00" }],
  }),
  "Create a one time quest for emailing Kris about sending a video sometime over the next 5 days, remind me every day until then at 3 pm.",
  JSON.stringify({
    title: "Email Kris",
    description: "Email Kris about sending a video",
    rankPoints: 10,
    dueDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    frequency: "once",
    isSecret: false,
    isAvailOnVacation: true,
    reminderFrequency: [
      { dayDiff: -5, time: "15:00" },
      { dayDiff: -4, time: "15:00" },
      { dayDiff: -3, time: "15:00" },
      { dayDiff: -2, time: "15:00" },
      { dayDiff: -1, time: "15:00" },
      { dayDiff: 0, time: "15:00" },
    ],
  }),
  "Create a secret quest for buying Smith a birthday gift today worth 100 points, remind me at 6 pm.",
  JSON.stringify({
    title: "Buy Smith's gift",
    description: "Go buy Smith's birthday gift",
    rankPoints: 10,
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    frequency: "once",
    isSecret: true,
    isAvailOnVacation: true,
    reminderFrequency: [{ dayDiff: 0, time: "18:00" }],
  }),
  "Create a quest reminding me to tell Sarah about how she has to bring her grandfather to the store.",
  JSON.stringify({
    title: "Talk to Sarah",
    description: "Tell Sarah about her bringing her grandfather to the store",
    rankPoints: 10,
    dueDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
    frequency: "once",
    isSecret: false,
    isAvailOnVacation: true,
    reminderFrequency: [{ dayDiff: 0, time: "12:00" }],
  }),
  "Create a quest reminding me to talk to Ren about the project report every week day at work.",
  JSON.stringify({
    title: "Talk to Ren",
    description: "Talk to Ren about the project report",
    rankPoints: 10,
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    frequency: "weekday",
    isSecret: false,
    isAvailOnVacation: false,
    reminderFrequency: [{ dayDiff: 0, time: "12:00" }],
  }),
  "Create a quest for working out at 3 pm on weekends, while not on vacation.",
  JSON.stringify({
    title: "Workout",
    description:
      "Go to workout by engaging in physical activity to improve health and fitness levels.",
    rankPoints: 10,
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    frequency: "weekend",
    isSecret: false,
    isAvailOnVacation: false,
    reminderFrequency: [{ dayDiff: 0, time: "15:00" }],
  }),
];
