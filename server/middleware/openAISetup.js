const { Configuration, OpenAIApi } = require("openai");
const { openAISetConn } = require("../global/globalConnections");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

openAISetConn(openai);
