import { create } from "zustand";
import { Prompt } from "../../types/prompt";

export const usePromptStore = create<Prompt>((set) => ({
  prompt: undefined,
  setPrompt: (prompt) => {
    set({ prompt });
  },
}));
