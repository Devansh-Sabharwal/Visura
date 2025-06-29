import { create } from "zustand";
type isMobile = {
  isMobile: boolean;
  setIsMobile: (state: boolean) => void;
};
export const useIsMobile = create<isMobile>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => {
    set({ isMobile });
  },
}));
