import { create } from "zustand";

type Code = {
  code: string;
  setCode: (code: string) => void;
};

export const useCodeStore = create<Code>((set) => ({
  code: "",
  setCode: (code) => {
    console.log("code is set to ", Date.now(), code);
    set({ code });
  },
}));
