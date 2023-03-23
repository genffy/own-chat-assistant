import { Message } from "@/types";
import { GetDataFromStreamResponse } from "@/utils/stream-response.util";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconSend } from "@tabler/icons-react";

type ChatsProps = {
  onSendMessage?: (message: string) => void;
};

export default function Chats({}: ChatsProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);
  const messageWrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    updateScoller();
  }, [messages]);
  function updateScoller() {
    setTimeout(() => {
      if (typeof messageWrapper.current?.scrollTop !== "undefined") {
        // scroll to bottom
        messageWrapper.current.scrollTop = messageWrapper.current.scrollHeight;
      }
    }, 100);
  }
  async function sendMessage() {
    if (message.length === 0) {
      alert("Please enter your message first.");
      return;
    }
    messages.push({
      type: "input",
      text: message,
      timestamp: Date.now(),
    });
    setMessages([...messages]);
    try {
      setDisable(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
        }),
      });
      GetDataFromStreamResponse(response, (text, status) => {
        // get last one, update text
        const lastMsg = messages.slice(-1)[0];
        if (messages.slice(-1)[0]) {
          if (messages.slice(-1)[0].type === "input") {
            messages.push({
              type: "response",
              text,
              timestamp: Date.now(),
            });
          } else {
            messages[messages.length - 1].text = `${lastMsg.text}${text}`;
          }
          setMessages([...messages]);
        }
        if (status) {
          setDisable(false);
          setMessage("");
        }
      });
    } catch (err) {
      setDisable(false);
    }
  }
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 py-10 pl-10 text-gray-800'>
      <div className='relative flex w-full flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-xl'>
        <div className='w-full bg-gray-300 p-4 text-center'>
          <h1 className='text-2xl font-semibold'>Chatbot</h1>
        </div>
        <div ref={messageWrapper} className='flex flex-grow flex-col overflow-auto p-4'>
          {messages.length === 0 ? (
            <div className='flex h-screen flex-col justify-center justify-items-center'>
              <Image
                width={48}
                height={48}
                src='/6598519.png'
                alt='content image'
                className='mx-auto'
              />
              <p className='mt-8 text-center text-lg font-semibold text-gray-700 dark:text-gray-200'>
                No chat messages, pls typing something :)
              </p>
            </div>
          ) : (
            messages.map((item, idx) => {
              const key = `${item.type}-${idx}`;
              if (item.type === "input") {
                return (
                  <div
                    key={key}
                    className='mt-2 ml-auto flex w-full max-w-xs justify-end space-x-3'
                  >
                    <div>
                      <div className='rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white'>
                        <p className='text-sm'>{item.text}</p>
                      </div>
                    </div>
                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gray-300'></div>
                  </div>
                );
              } else {
                return (
                  <div key={key} className={`mt-2 flex w-full max-w-xs space-x-3`}>
                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gray-300'></div>
                    <div>
                      <div className='rounded-r-lg rounded-bl-lg bg-gray-300 p-3'>
                        <p className='text-sm'>{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
        <div className='w-full bg-gray-300 p-4 text-center'>
          <form
            action='#'
            onSubmit={(evt) => {
              evt.preventDefault();
              sendMessage();
            }}
          >
            <div className='mx-auto flex items-center'>
              <input
                disabled={disable}
                type='text'
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                placeholder='Try typing some words...'
                className='text-grey-dark mr-2 flex-1 appearance-none rounded p-3 shadow focus:outline-none'
              />
              <button
                disabled={disable || message.length === 0}
                type='submit'
                className='flex cursor-pointer items-center justify-center rounded-md bg-blue-600 p-3 text-base font-semibold text-white shadow-md hover:bg-indigo-600'
              >
                Send &nbsp;<IconSend></IconSend>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
