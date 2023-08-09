const { Router } = require("express");
const questRouter = require("./features/quest/questRouter");
const adventurerRouter = require("./features/adventurer/adventurerRouter");
const searchRouter = require("./features/search/searchRouter");
const libraryRouter = require("./features/library/libraryRouter");
const completionRouter = require("./features/completion/completionRouter");
const discordRouter = require("./features/discord/discordRouter");
const responseHandler = require("./middleware/responseHandler");
const imageRouter = require("./features/image/imageRouter");
const router = Router();

const specialRouter = {};
["get", "post", "put", "patch"].forEach((name) => {
  specialRouter[name] = (route, callback) =>
    router[name](route, (req, res) =>
      responseHandler(
        res,
        callback.constructor.name === "AsyncFunction"
          ? callback(req, res)
          : new Promise((resolve) => resolve(callback(req, res)))
      )
    );
});

questRouter(specialRouter);
adventurerRouter(specialRouter);
discordRouter(specialRouter);
searchRouter(specialRouter);
completionRouter(specialRouter);
libraryRouter(specialRouter);
imageRouter(router);

module.exports = router;
