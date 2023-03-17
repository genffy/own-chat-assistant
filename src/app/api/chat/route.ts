import { StreamResponce } from "@/utils/stream-response.util";
import { Configuration, OpenAIApi, type CreateChatCompletionResponse, type CreateCompletionResponse } from "openai";
import { httpsOverHttp } from "tunnel";

const tunnel = httpsOverHttp({
  proxy: {
    host: "127.0.0.1",
    port: 9999,
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = "system";
  const content = "hello world";
  const completion = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role,
          content,
        },
      ],
      stream: true,
    },
    { responseType: "stream" },
  );
  const stream = await StreamResponce<CreateChatCompletionResponse>(completion);
  return new Response(stream);
  // return Response.json(messages)
}

export async function POST(request: Request) {
  const { message } = await request.json();
  const res = await openai.createCompletion(
    {
      model: "text-davinci-003",
      // model:"text-curie-001",
      prompt: message,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 500,
      stream: true,
      n: 1,
    },
    { responseType: "stream" },
  );
  const stream = await StreamResponce<CreateCompletionResponse>(res);
  return new Response(stream);
}
