const { Router } = require("express");
const questRouter = require("./features/quest/questRouter");
const adventurerRouter = require("./features/adventurer/adventurerRouter");
const discordRouter = require("./features/discord/discordRouter");
const searchRouter = require("./features/search/searchRouter");
const router = Router();

questRouter(router);
adventurerRouter(router);
discordRouter(router);
searchRouter(router);
module.exports = router;
