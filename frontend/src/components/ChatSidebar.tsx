import {
  Clapperboard,
  MessageCirclePlus,
  MessageSquareText,
  Sidebar,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import SidebarComponent from "./Sidebar";
import { useRouter } from "next/navigation";
import { useChatHistoryStore } from "@/store/chatHistoryStore";
import { useSession } from "next-auth/react";
import { getHistory } from "@/api/history";
import toast from "react-hot-toast";
import { useIsMobile } from "@/store/isMobileStore";
import { useActiveTabStore } from "@/store/activeTabStore";
export default function ChatSidebar() {
  const isMobile = useIsMobile((state) => state.isMobile);
  const { data, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const history = useChatHistoryStore((state) => state.history);
  const setHisory = useChatHistoryStore((state) => state.setHistory);
  const setMobileActiveTab = useActiveTabStore(
    (state) => state.setMobileActiveTab
  );
  const mobileActiveTab = useActiveTabStore((state) => state.mobileActiveTab);
  useEffect(() => {
    if (status == "loading") return;
    const fetchHistory = async () => {
      try {
        const history = await getHistory(data?.fastApiToken || "");
        setHisory(history.chats);
      } catch (e: any) {
        if (e.message === "Unauthorized") {
          toast.error("Session expired. Please sign in again.", {
            position: "top-center",
          });
          setTimeout(() => {
            router.push("/signin");
          }, 3000);
        }
      }
    };
    fetchHistory();
  }, [status]);
  return (
    <div className="relative w-8 sm:w-12 h-full sm:border-r border-white/5 flex  pt-0 items-center flex-col gap-6 ">
      <span onClick={() => setOpen(true)} title="Open Sidebar" className="mt-4">
        <Sidebar
          size={isMobile ? 20 : 24}
          className="text-white/70 cursor-pointer"
        />
      </span>

      <span onClick={() => router.push("/chat")} title="New Chat">
        <MessageCirclePlus
          size={isMobile ? 20 : 24}
          className="text-white/70 cursor-pointer"
        />
      </span>
      {isMobile && (
        <span
          title="Chat"
          className={`${
            mobileActiveTab == "Chat" ? "bg-button-bg" : ""
          } w-full py-2 flex justify-center text-white/70 `}
          onClick={() => setMobileActiveTab("Chat")}
        >
          <MessageSquareText size={isMobile ? 20 : 24} />
        </span>
      )}
      {isMobile && (
        <span
          title="Animation"
          className={`${
            mobileActiveTab == "Animation" ? "bg-button-bg" : ""
          } w-full py-2 flex justify-center text-white/70 `}
          onClick={() => setMobileActiveTab("Animation")}
        >
          <Clapperboard size={isMobile ? 20 : 24} />
        </span>
      )}
      <SidebarComponent history={history} open={open} setOpen={setOpen} />
    </div>
  );
}
