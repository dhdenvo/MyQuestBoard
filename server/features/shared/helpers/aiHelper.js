const { openAIConn } = require("../../../global/globalConnections");

const generateSingleResponse = async (message, systemContext) => {
  const openai = openAIConn();
  const messages = [];
  if (systemContext)
    messages.push({
      role: "system",
      content: systemContext,
    });
  messages.push({ role: "user", content: message });
  const chatCompletion = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL,
    messages,
  });
  return chatCompletion.data.choices[0].message;
};

module.exports = {
  generateSingleResponse,
};
