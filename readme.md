# Hub API - LangChain, OpenAI and Node.js Example

In this example repository we will focus on building a simple agent that can consume and use the functions definitions provided by Superface using the LangChain.js library, OpenAI and Node.js.

## Run this example

Clone the repository, and run:

```
npm install
```

This will install the LangChain dependencies, as well as Axios for making HTTP requests to the Hub API.

### Add API Keys

After everything is installed you will need to add two API keys in `src/index.js`:

```
const OPENAI_API_KEY = "<your-openai-api-key>";
const SUPERFACE_AUTH_TOKEN = "<your-superface-auth-token>";
```

### Change the prompt

By default, there is a prompt that will make two calls to Superface's Hub API to get the weather details for two different cities. You can edit this to add more if you like, or change the cities to those nearer to you.

```
const PROMPT = "What's the weather like in Prague and in Kosice?";
```

## For more information

The full breakdown can be found here: [https://superface.ai/docs/api/examples/langchain](https://superface.ai/docs/api/examples/langchain)
