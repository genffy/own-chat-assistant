import { ChatMessage } from '@/types'
import { Avatar, createStyles, Group, rem, ScrollArea, Text } from '@mantine/core';
import Image from 'next/image'
import { useEffect, useRef } from 'react';

export type CahtsProps = {
  messages: ChatMessage[];
};

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
  },
}));

export default function Chats({ messages }: CahtsProps) {
  const messageWrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    updateScoller()
  }, [messages])
  function updateScoller() {
    setTimeout(() => {
      if (typeof messageWrapper.current?.scrollTop !== "undefined") {
        // scroll to bottom
        messageWrapper.current.scrollTop = messageWrapper.current.scrollHeight;
      }
    }, 100);
  }
  const { classes } = useStyles();
  return (
    <ScrollArea h={1000}>
      <div ref={messageWrapper}>
        {
          messages.length === 0 ? <div className="flex flex-col justify-center justify-items-center h-screen">
            <Image width={48} height={48} src="/6598519.png" alt="content image" className="mx-auto" />
            <p className="mt-8 text-lg font-semibold text-center text-gray-700 dark:text-gray-200">No chat messages, pls typing something :)</p>
          </div> :
            messages.map((item, idx) => {
              const key = `${item.type}-${idx}`
              const { author, timestamp } = item
              if (item.type === 'input') {
                return <div key={key} className="chat-message">
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                      <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{item.text}</span></div>
                    </div>
                    <Avatar src={author.image} alt={author.name} radius="xl" />
                  </div>
                  {/* <Group>
                    <Avatar src={author.image} alt={author.name} radius="xl" />
                    <div>
                      <Text size="sm">{author.name}</Text>
                      <Text size="xs" color="dimmed">
                        {timestamp}
                      </Text>
                    </div>
                  </Group>
                  <Text className={classes.body} size="sm">
                    {item.text}
                  </Text> */}
                </div>
              } else {
                return <div key={key} className="chat-message">
                  <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                      <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{item.text}</span></div>
                    </div>
                    <Avatar src={author.image} alt={author.name} radius="xl" />
                  </div>
                  {/* <Group>
                    <Avatar src={author.image} alt={author.name} radius="xl" />
                    <div>
                      <Text size="sm">{author.name}</Text>
                      <Text size="xs" color="dimmed">
                        {timestamp}
                      </Text>
                    </div>
                  </Group>
                  <Text className={classes.body} size="sm">
                    {item.text}
                  </Text> */}
                </div>
              }
            })
        }
      </div>
    </ScrollArea>

  )
}
