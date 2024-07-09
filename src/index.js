import { ChatOpenAI } from "@langchain/openai";
import { ToolMessage } from "@langchain/core/messages";
import colors from "colors";
import axios from "axios";

// Set up constants for the Superface Hub API and the prompt

const SUPERFACE_BASE_URL = "https://pod.superface.ai/api/hub";
const PROMPT = "What's the weather like in Prague and in Kosice?";

(async () => {
  // @description: Get the tools from the Superface Hub API
  async function getSuperfaceTools() {
    try {
      const response = await axios.get(`${SUPERFACE_BASE_URL}/fd`, {
        headers: {
          Authorization: `Bearer ${process.env.SUPERFACE_AUTH_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  // @description: Perform the action using the Superface Hub API
  async function performAction(functionName, toolCallArguments) {
    console.log(
      `Calling Superface Hub API function ${functionName} with arguments ${JSON.stringify(
        toolCallArguments
      )}`["green"]
    );
    try {
      const actionResponse = await axios.post(
        `${SUPERFACE_BASE_URL}/perform/${functionName}`,
        toolCallArguments,
        {
          headers: {
            Authorization: `Bearer ${process.env.SUPERFACE_AUTH_TOKEN}`,
            "Content-Type": "application/json",
            "x-superface-user-id": "sflangchainexample|1234",
          },
        }
      );

      let result = JSON.stringify(actionResponse.data);

      // Log the response to demonstrate the result format from Superface Hub API
      console.log(`SUPERFACE RESPONSE: ${result}`);

      return result;
    } catch (error) {
      console.error(`PERFORM ERROR: ${error.response}`);
      return error.response.data;
    }
  }

  // Set up the LLM as GPT-4o using LangChain's ChatOpenAI class
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    maxTokens: 128,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Retrieve the tools list from the Superface Hub API
  const superfaceTools = await getSuperfaceTools();

  // Bind the list of available tools to the LLM
  const llmWithTools = llm.bindTools(superfaceTools);

  // Invoke the LLM with the initial prompt that requires multiple tool calls
  const res = await llmWithTools.invoke(PROMPT);

  // Format the results from calling the tool calls back to OpenAI as ToolMessages
  const toolMessages = res.tool_calls?.map(async (toolCall) => {
    const toolCallResult = await performAction(toolCall.name, toolCall.args);

    return new ToolMessage({
      tool_call_id: toolCall.id,
      name: toolCall.name,
      content: toolCallResult,
    });
  });

  // Re-invoke the LLM with the initial prompt and the tool messages
  // to continue the conversation and get the final response.
  const finalResponse = await llmWithTools.invoke([
    PROMPT,
    res,
    ...(await Promise.all(toolMessages ?? [])),
  ]);

  // Return the initial prompt and the final response
  console.log("\n\n" + PROMPT["blue"] + "\n\n" + finalResponse.content);
})();
