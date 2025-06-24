import { create } from "zustand";

import { Chat } from "../../types/chat";

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
