import { create } from "zustand";

type ActiveTab = {
  activeTab: string;
  setActiveTab: (code: string) => void;
};

export const useActiveTabStore = create<ActiveTab>((set) => ({
  activeTab: "Code",
  setActiveTab: (activeTab) => {
    set({ activeTab });
  },
}));
