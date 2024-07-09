# Hub API - LangChain, OpenAI and Node.js Example

In this example repository we will focus on building a simple agent that can consume and use the function definitions provided by Superface using the LangChain.js library, OpenAI and Node.js.

## Run this example

Clone the repository, and run:

```
npm install
```

This will install the LangChain dependencies, as well as Axios for making HTTP requests to the Hub API.

### Add API Keys

After everything is installed you will need to add two API keys in your `.env` file. If this does not exist, go ahead and create it at the root level:

```
OPENAI_API_KEY = <your-openai-api-key>
SUPERFACE_AUTH_TOKEN = <your-superface-auth-token>
```

### Change the prompt

By default, there is a prompt that will make two calls to Superface's Hub API to get the weather details for two different cities. You can edit this to add more if you like or change the cities to those nearer to you.

```
const PROMPT = "What's the weather like in Prague and in Kosice?";
```

### Run it

```
npm run example
```

After a moment you will see responses from the Hub API, followed by the final result. Something like this:

```
SUPERFACE RESPONSE: {"status":"success","assistant_hint":"Format the result in 'result' field to the user. If the user asked for a specific format, respect it","result":{"description":"Partly cloudy","feelsLike":17,"temperature":17}}
SUPERFACE RESPONSE: {"status":"success","assistant_hint":"Format the result in 'result' field to the user. If the user asked for a specific format, respect it","result":{"description":"Partly cloudy","feelsLike":15,"temperature":15}}
The current weather in Prague is partly cloudy with a temperature of 15°C, and in Kosice, it is also partly cloudy with a temperature of 17°C.
```

## For more information

The full breakdown can be found here: [https://superface.ai/docs/api/examples/langchain](https://superface.ai/docs/api/examples/langchain)
