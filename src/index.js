const { ChatOpenAI } = require("@langchain/openai");
const { ToolMessage } = require("@langchain/core/messages");
const axios = require('axios')

OPENAI_API_KEY = "<your-openai-api-key>";
SUPERFACE_AUTH_TOKEN = "<your-superface-auth-token>";
SUPERFACE_BASE_URL = "https://pod.superface.ai/api/hub";

(async () => {

  async function getSuperfaceTools() {
    try {
      const response = await axios.get(`${SUPERFACE_BASE_URL}/fd`, {
        headers: {
          Authorization: `Bearer ${SUPERFACE_AUTH_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function performAction(functionName, toolCallArguments) {
    try {
      const actionResponse = await axios.post(`${SUPERFACE_BASE_URL}/perform/${functionName}`, toolCallArguments,
        { headers: {
            Authorization: `Bearer ${SUPERFACE_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
            'x-superface-user-id': 'sflangchainexample|123'
          }
      });

      let result = JSON.stringify(actionResponse.data);
      console.log(`SUPERFACE RESPONSE: ${result}`);
      return result;
      
    } catch (error) {
      console.error(`PERFORM ERROR: ${error.response}`);
      return error.response.data;
    }
  }

  // Bind function to the model as a tool
  const chat = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    maxTokens: 128,
    openAIApiKey: OPENAI_API_KEY,
  }).bind({
    tools: await getSuperfaceTools(),
    tool_choice: "auto",
  });

  // Ask initial question that requires multiple tool calls
  const res = await chat.invoke([
    ["human", "What's the weather like in Prague and in Kosice?"],
  ]);

  // Format the results from calling the tool calls back to OpenAI as ToolMessages
  const toolMessages = res.additional_kwargs.tool_calls?.map(async (toolCall) => {
    const toolCallResult = await performAction(toolCall.function.name, JSON.parse(toolCall.function.arguments));

    return new ToolMessage({
      tool_call_id: toolCall.id,
      name: toolCall.function.name,
      content: toolCallResult
    });
  });

  // Send the results back as the next step in the conversation
  const finalResponse = await chat.invoke([
    ["human", "What's the weather like in Prague and in Kosice?"],
    res,
    ...(await Promise.all(toolMessages ?? []))
  ]);

  console.log(finalResponse.content);
})();