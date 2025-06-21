import { create } from "zustand";
import { Message } from "../../types/message";

type Chat = {
  chatId: string | undefined;
  setChatId: (chatId: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
};

export const useChatStore = create<Chat>((set) => ({
  chatId: undefined,
  setChatId: (chatId) => {
    console.log("called", chatId);
    set({ chatId });
  },
  messages: [],
  setMessages: (messages) => {
    set(() => ({
      messages: messages,
    }));
  },
}));
