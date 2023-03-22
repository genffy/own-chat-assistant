"use client";
import { Message } from "@/types";
import Image from "next/image";
import { GetDataFromStreamResponse } from "@/utils/stream-response.util";
import { useEffect, useRef, useState } from "react";
import { IconSend, IconLayoutSidebarLeftExpand, IconLayoutSidebarLeftCollapse, IconPlaystationX } from "@tabler/icons-react";
import ConfigForm from "./component/config-form";

export default function MessageHistory() {
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
  const [fold, setFold] = useState(false);
  function toggleHandle() {
    setFold(!fold);
  }
  return (
    <div className={`h-screen w-full dark:bg-gray-800 grid grid-cols-[${fold ? "200px" : "1rem"}_1fr]`}>
      {/* chat */}
      <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 text-gray-800 p-10'>
        <div className='relative flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden'>
          <div ref={messageWrapper} className='flex flex-col flex-grow h-0 p-4 overflow-auto'>
            {messages.length === 0 ? (
              <div className='flex flex-col justify-center justify-items-center h-screen'>
                <Image width={48} height={48} src='/6598519.png' alt='content image' className='mx-auto' />
                <p className='mt-8 text-lg font-semibold text-center text-gray-700 dark:text-gray-200'>
                  No chat messages, pls typing something :)
                </p>
              </div>
            ) : (
              messages.map((item, idx) => {
                const key = `${item.type}-${idx}`;
                if (item.type === "input") {
                  return (
                    <div key={key} className='flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end'>
                      <div>
                        <div className='bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg'>
                          <p className='text-sm'>{item.text}</p>
                        </div>
                      </div>
                      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
                    </div>
                  );
                } else {
                  return (
                    <div key={key} className={`flex w-full mt-2 space-x-3 max-w-xs`}>
                      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
                      <div>
                        <div className='bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'>
                          <p className='text-sm'>{item.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
          <div className='bg-gray-300 p-4 w-full text-center'>
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
                  className='flex-1 appearance-none rounded shadow p-3 text-grey-dark mr-2 focus:outline-none'
                />
                <button
                  disabled={disable || message.length === 0}
                  type='submit'
                  className='bg-blue-600 cursor-pointer flex justify-center items-center text-white text-base font-semibold rounded-md shadow-md hover:bg-indigo-600 p-3'
                >
                  Send &nbsp;<IconSend></IconSend>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfigForm toggle={toggleHandle}></ConfigForm>
    </div>
  );
}
