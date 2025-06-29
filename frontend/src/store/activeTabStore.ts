import { create } from "zustand";

type ActiveTab = {
  activeTab: string;
  mobileActiveTab: string;
  setActiveTab: (code: string) => void;
  setMobileActiveTab: (tab: string) => void;
};

export const useActiveTabStore = create<ActiveTab>((set) => ({
  activeTab: "Code",
  mobileActiveTab: "",
  setActiveTab: (activeTab) => {
    set({ mobileActiveTab: "Animation" });
    set({ activeTab });
  },
  setMobileActiveTab: (mobileActiveTab) => {
    set({ mobileActiveTab });
  },
}));
