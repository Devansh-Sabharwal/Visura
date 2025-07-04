import { useActiveTabStore } from "@/store/activeTabStore";
import { useAnimationStore } from "@/store/animationStore";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAnimationPolling = (requestId: string) => {
  const { data, status } = useSession();
  const videoUrl = useAnimationStore((state) => state.videoUrl);
  const setVideoUrl = useAnimationStore((state) => state.setVideoUrl);
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);
  const chatId = useChatStore((state) => state.chatId);
  const [loading, setLoading] = useState(true);
  const setMessages = useChatStore((state) => state.setMessages);
  useEffect(() => {
    if (status == "loading") return;
    if (!requestId || !requestId.trim()) {
      setLoading(false); // prevent indefinite loading state
      return;
    }
    setLoading(true);
    let isCancelled = false;

    async function pollVideo() {
      let tries = 0;
      const maxTries = 20;

      while (tries < maxTries && !isCancelled) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_FASTAPI_URL}/videos/${requestId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${data?.fastApiToken}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (!isCancelled) {
              setVideoUrl(data.video_url);
              setLoading(false);
              setActiveTab("Animation");
              setMessages((prevMessages) => {
                const updated = [...prevMessages];
                const lastIndex = updated.length - 1;
                if (updated[lastIndex]?.role === "model") {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    videoUrl: data.video_url,
                  };
                }
                return updated;
              });
            }
            return;
          }
        } catch (e) {
          console.error("Polling error:", e);
        }

        await new Promise((res) => setTimeout(res, 3000)); // 4-second delay
        tries++;
        if (tries == maxTries)
          toast.error("Animation Not found Please Try Again");
      }

      if (!isCancelled) setLoading(false);
    }

    pollVideo();

    return () => {
      isCancelled = true;
    };
  }, [chatId, requestId, status]);

  return { videoUrl, loading };
};
