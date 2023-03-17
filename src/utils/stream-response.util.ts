import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import type { AxiosResponse } from "axios";
// server side
export function StreamResponce<T>(res: AxiosResponse<T, any>) {
  let counter = 0;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const _data = json.choices[0];
            // text
            let text;
            if (_data.text !== undefined) {
              // CreateCompletionResponse
              text = _data.text;
            } else if (_data.delta) {
              // CreateChatCompletionResponse
              text = _data.delta?.content || "";
            }
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.data.on("data", (data) => {
        parser.feed(decoder.decode(data));
      });
    },
  });
}
// client side
export async function GetDataFromStreamResponse(res: Response, handler: (value: string, status: boolean) => void) {
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  // This data is a ReadableStream
  const data = res.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    console.log("chunkValue", chunkValue);
    handler(chunkValue, done);
  }
}
