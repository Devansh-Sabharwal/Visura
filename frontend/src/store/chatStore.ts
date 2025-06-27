import { create } from "zustand";

import { Chat } from "../types/chat";

export const useChatStore = create<Chat>((set) => ({
  chatId: undefined,
  setChatId: (chatId) => {
    set({ chatId });
  },
  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  isLoading: false,
  setLoading: (state: boolean) => {
    set(() => ({
      isLoading: state,
    }));
  },
}));
