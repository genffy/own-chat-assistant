export type Message = {
  text: string;
  timestamp: number;
  type: string;
};

export type ChatMessage = {
  author: {
    name: string;
    image: string;
  };
} & Message;
