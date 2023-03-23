"use client";

import AdjustParam from "@/components/adjust-param";
import Chats from "@/components/chats";
import Head from "next/head";
import { AppShell, Header, Group, Footer, Button, TextInput } from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import ColorThemeToggle from "@/components/toggle-color-theme";
import { Message } from "@/types";
import { GetDataFromStreamResponse } from "@/utils/stream-response.util";
import { useState } from "react";
import { IconSend } from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";
import { LOCAL_OPENAI_PARAMS_KEY } from "@/constants";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);
  const [lsData] = useLocalStorage({
    key: LOCAL_OPENAI_PARAMS_KEY,
  });
  let codeMark = "";
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
          ...JSON.parse(lsData),
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
            if (!codeMark) {
              codeMark = text;
            } else {
              // code block end remove it
              codeMark = "";
            }
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
  function submitHandle() {
    sendMessage();
  }

  return (
    <>
      <Head>
        <title>Message History - ChatGPT</title>
        <meta name='description' content='View your message history with ChatGPT' />
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <AppShell
        styles={(theme) => ({
          main: {
            height: "100vh",
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
        header={
          <Header height={60} px='md'>
            <Group position='apart' sx={{ height: "100%" }}>
              <MantineLogo type='mark' size={30} />
              <Group>
                <ColorThemeToggle></ColorThemeToggle>
                <AdjustParam></AdjustParam>
              </Group>
            </Group>
          </Header>
        }
        footer={
          <Footer height={75} p='md'>
            <TextInput
              disabled={disable}
              placeholder='Try typing some words...'
              label=''
              withAsterisk
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              rightSectionWidth={"7rem"}
              rightSection={
                <Button
                  disabled={disable}
                  fullWidth={true}
                  uppercase={true}
                  onClick={submitHandle}
                  rightIcon={<IconSend />}
                  styles={() => ({
                    root: {
                      height: "100%",
                    },
                  })}
                >
                  Send
                </Button>
              }
            />
          </Footer>
        }
      >
        <Chats messages={messages} codeMark={codeMark}></Chats>
      </AppShell>
    </>
  );
}
