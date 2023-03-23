import { Message } from "@/types";
import {
  Avatar,
  createStyles,
  Group,
  Paper,
  rem,
  ScrollArea,
  TypographyStylesProvider,
  Text,
  Center,
} from "@mantine/core";
import { useEffect, useRef } from "react";
import Markdown from "./markdown";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    marginBottom: theme.spacing.md,
    "&:last-child": {
      marginBottom: 0,
    },
  },
  commentInput: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    marginBottom: theme.spacing.md,
    "&:last-child": {
      marginBottom: 0,
    },
    backgroundColor: theme.colors.blue[5],
  },

  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },
  bodyInput: {
    paddingRight: rem(54),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
  contentInput: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : "#fff",
  },
}));

interface CommentHtmlProps {
  text: string;
  type: string;
}

export function CommentHtml({ text, type }: CommentHtmlProps) {
  const { classes } = useStyles();
  return (
    <Paper
      withBorder
      radius='md'
      className={type === "input" ? classes.commentInput : classes.comment}
    >
      <Group position={type === "input" ? "right" : "left"}>
        {type === "input" ? null : (
          <Avatar
            src={
              "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
            }
            alt={"Jacob Warnhalter"}
            radius='xl'
          />
        )}
        <TypographyStylesProvider className={type === "input" ? "" : classes.body}>
          {type === "input" ? (
            <div
              className={type === "input" ? classes.contentInput : classes.content}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : (
            <Markdown content={text} />
          )}
        </TypographyStylesProvider>
        {type !== "input" ? null : (
          <Avatar
            src={
              "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
            }
            alt={"Jacob Warnhalter"}
            radius='xl'
          />
        )}
      </Group>
    </Paper>
  );
}

type CahtsProps = {
  messages: Message[];
  codeMark?: string;
};

export default function Chats({ messages, codeMark = "" }: CahtsProps) {
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (typeof viewport.current?.scrollTop !== "undefined") {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return messages.length === 0 ? (
    <Center h='100%'>
      <Text>No chat messages, pls typing something :)</Text>
    </Center>
  ) : (
    <ScrollArea h='100%' viewportRef={viewport}>
      {messages.map((item, idx) => {
        const key = `${item.type}-${idx}`;
        return (
          <CommentHtml key={key} type={item.type} text={`${item.text + codeMark}`}></CommentHtml>
        );
      })}
    </ScrollArea>
  );
}
