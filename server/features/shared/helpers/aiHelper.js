const { openAIConn } = require("../../../global/globalConnections");

const generateSingleResponse = async (message) => {
  const openai = openAIConn();
  const chatCompletion = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL,
    messages: [{ role: "user", content: message }],
  });
  return chatCompletion.data.choices[0].message;
};

module.exports = {
  generateSingleResponse,
};
