const { openAIConn } = require("../../../global/globalConnections");

// Generate a text response from a single message
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
  const response = chatCompletion.data.choices[0].message;
  return response?.content || response;
};

// Generate an ai image url from a link
const generateAiImage = async (prompt) => {
  const openai = openAIConn();
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "1024x1024",
  });
  return response.data.data[0].url;
};

module.exports = {
  generateSingleResponse,
  generateAiImage,
};
