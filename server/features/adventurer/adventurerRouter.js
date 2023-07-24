module.exports = (router) => {
  router.get("/adventurer", (req, res) => {
    console.log("Testing");
    return "Success";
  });
};
