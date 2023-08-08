const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { model } = require("mongoose");
const { COLLECTION_NAMES } = require("../global/config.json");
const adventurerModel = model(COLLECTION_NAMES.ADVENTURER);

// Create function for retrieving the user from an id for passport
const retrieveUser = (id, done) =>
  adventurerModel.findById(id).then((adventurer) => done(null, adventurer));

passport.deserializeUser(retrieveUser);
passport.use(new LocalStrategy((id, _, done) => retrieveUser(id, done)));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

module.exports = (router) => {
  router.post("/login/:id", (...data) => {
    const [req] = data;
    // Not using an auth system so able to swap profiles easily
    req.body = {
      username: req.params.id,
      password: "null",
    };
    // Set up auth redirect routes
    passport.authenticate("local", {
      successRedirect: "/api/authed",
      failureRedirect: "/api/authed",
    })(...data);
  });

  router.get("/authed", (req, res) =>
    res.json({ code: 200, size: 1, data: [req.isAuthenticated()] })
  );
};
