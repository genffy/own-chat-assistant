import { StreamResponce } from "@/utils/stream-response.util";
import {
  Configuration,
  OpenAIApi,
  type CreateChatCompletionResponse,
  type CreateCompletionResponse,
} from "openai";
import { httpsOverHttp } from "tunnel";

const tunnel = httpsOverHttp({
  proxy: {
    host: "127.0.0.1",
    port: 7890,
  },
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  baseOptions: {
    httpsAgent: process.env.NODE_ENV === "development" ? tunnel : null,
    proxy: false,
  },
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const { api, message, ...rest } = await request.json();
  // get headers
  if (api === "createCompletion") {
    const res = await openai.createCompletion(
      {
        ...rest,
        model: "text-davinci-003",
        prompt: message,
        stream: true,
      },
      { responseType: "stream" },
    );
    const stream = await StreamResponce<CreateCompletionResponse>(res);
    return new Response(stream);
  } else if (api === "createChatCompletion") {
    const role = "system";
    const completion = await openai.createChatCompletion(
      {
        ...rest,
        messages: [
          {
            role,
            content: message,
          },
        ],
        stream: true,
      },
      { responseType: "stream" },
    );
    const stream = await StreamResponce<CreateChatCompletionResponse>(completion);
    return new Response(stream);
  }
}
