import { create } from "zustand";

type Animation = {
  requestId: string | undefined;
  videoUrl: string;
  setVideoUrl: (code: string) => void;
  setRequestId: (id: string) => void;
};

export const useAnimationStore = create<Animation>((set) => ({
  requestId: undefined,
  videoUrl: "",
  setVideoUrl: (videoUrl) => {
    console.log("video Url set", videoUrl);
    set({ videoUrl });
  },
  setRequestId: (requestId) => {
    set({ requestId });
  },
}));
