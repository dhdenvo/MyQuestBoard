require("dotenv").config();
const { join } = require("path");

require("./middleware/mongoSetup");
require("./middleware/discordSetup");
require("./middleware/openAISetup");

const express = require("express");
const app = express();
const cors = require("cors");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const router = require("./router");

app.use(cors({ origin: "*" }));
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: true })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize({ userProperty: "adventurer" }));
app.use(passport.session());

app.use(express.static(join(__dirname, "/build")));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "/build/index.html"));
});

require("./middleware/auth")(router);
app.use("/api", router);
require("./jobs/cronHandler");

app.listen(process.env.PORT, (err) => {
  if (err) console.error("Unable to start server:", err);
  console.log("Server started on port", process.env.PORT);
});
