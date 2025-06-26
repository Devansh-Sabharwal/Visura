import { create } from "zustand";

type Animation = {
  videoUrl: string;
  setVideoUrl: (code: string) => void;
};

export const useAnimationStore = create<Animation>((set) => ({
  videoUrl: "",
  setVideoUrl: (videoUrl) => {
    set({ videoUrl });
  },
}));
