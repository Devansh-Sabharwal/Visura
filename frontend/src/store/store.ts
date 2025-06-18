import { create } from "zustand";

type Chat = {
  chatId: string | undefined;
  setChatId: (chatId: string) => void;
  messages: string[];
  setMessages: (messages: string[]) => void;
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
