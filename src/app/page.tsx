"use client";

import AdjustParam from "@/components/adjust-param";
import Chats from "@/components/chats";
import InputSender from "@/components/input-sender";
import ToggleColorTheme from "@/components/toggle-color-theme";
import { ChatMessage } from "@/types";
import {
  AppShell,
  Header,
  Group,
  Box,
  Burger,
  Drawer,
  Container,
  useMantineTheme,
  MediaQuery,
  Aside,
  Footer,
} from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function HeaderMegaMenu() {
  // avatar use https://en.gravatar.com/site/implement/images/
  const cakeMessages: ChatMessage[] = [
    {
      timestamp: 1679043102292,
      text: "Can be verified on any platform using docker",
      type: "input",
      author: {
        name: "测试",
        image:
          "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
      },
    },
    {
      timestamp: 1679043102300,
      text: "Your error message says permission denied, npm global installs must be given root privileges.",
      type: "response",
      author: {
        name: "测试",
        image: "https://www.gravatar.com/avatar/05b6d7cc7c662bf81e01b39254f88a49?d=identicon",
      },
    },
    {
      timestamp: 1679043102300,
      text: `
      Command was run with root privileges. I'm sure about that.
      I've update the description so it's more obviously now
      FYI https://askubuntu.com/a/700266/510172
      `,
      type: "input",
      author: {
        name: "测试",
        image: "https://www.gravatar.com/avatar/05b6d7cc7c662bf81e01b39254f88a49?d=identicon",
      },
    },
    {
      timestamp: 1679043102300,
      text: `Any updates on this issue? I'm getting the same error when trying to install devtools.Thanks`,
      type: "response",
      author: {
        name: "测试",
        image: "https://www.gravatar.com/avatar/05b6d7cc7c662bf81e01b39254f88a49?d=identicon",
      },
    },
  ];
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      footer={
        <Footer height={100} p='md'>
          <InputSender />
        </Footer>
      }
      header={
        <Header height={60} px='md'>
          <Group position='apart' sx={{ height: "100%" }}>
            {/* TODO design log */}
            <MantineLogo size={30} />
            {/* <ToggleColorTheme></ToggleColorTheme> */}
            <AdjustParam></AdjustParam>
          </Group>
        </Header>
      }
    >
      <Chats messages={cakeMessages}></Chats>
    </AppShell>
  );
}
