import { create } from "zustand";
import { Prompt } from "../types/prompt";

export const usePromptStore = create<Prompt>((set) => ({
  prompt: "",
  setPrompt: (prompt) => {
    set({ prompt });
  },
}));
