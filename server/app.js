require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const router = require("./router");

app.use(cors({ origin: "*" }));
app.use(
  // Store a cookie session for 1 month
  cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ["cookie monster"] })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", router);
app.listen(process.env.PORT, (err) => {
  if (err) console.error("Unable to start server:", err);
  console.log("Server started on port", process.env.PORT);
});
