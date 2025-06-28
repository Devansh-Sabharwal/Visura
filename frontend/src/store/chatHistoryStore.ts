import { create } from "zustand";
import { ChatHistory } from "@/types/chatHistory";
type History = {
  history: ChatHistory[];
  setHistory: (history: ChatHistory[]) => void;
};
export const useChatHistoryStore = create<History>((set) => ({
  history: [],
  setHistory: (history) => {
    set({ history });
  },
}));
