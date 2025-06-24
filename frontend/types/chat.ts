import { Message } from "./message";

export type Chat = {
  chatId: string | undefined;
  setChatId: (chatId: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
};
