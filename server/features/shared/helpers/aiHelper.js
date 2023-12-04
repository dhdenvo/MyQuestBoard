const { openAIConn } = require("../../../global/globalConnections");
const { COMPLETION_ROLES } = require("../configs/aiConfig.json");

// Generate a test response from a series of messages
const generateConversationResponse = (context, conversation) => {
  // Combine the context & conversation and ensure there aren't extra properties
  const messages = [
    ...context.map((content) => ({ role: COMPLETION_ROLES.SYSTEM, content })),
    ...conversation,
  ].map(({ role, content }) => ({ role, content }));
  return generateResponse(messages);
};

// Generate a text response from a single message
const generateSingleResponse = (message, systemContext) => {
  const messages = [];
  if (systemContext)
    messages.push({
      role: COMPLETION_ROLES.SYSTEM,
      content: systemContext,
    });
  messages.push({ role: COMPLETION_ROLES.USER, content: message });
  return generateResponse(messages);
};

const generateResponse = async (messages) => {
  const openai = openAIConn();
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
  generateConversationResponse,
  generateSingleResponse,
  generateAiImage,
};
