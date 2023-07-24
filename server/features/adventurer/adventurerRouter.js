module.exports = (router) => {
  router.get("/adventurer", (req, res) => {
    console.log("Testing");
    res.json("Success");
  });
};
