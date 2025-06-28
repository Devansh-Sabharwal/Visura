import { Plus, Sidebar } from "lucide-react";
import React, { useEffect, useState } from "react";
import SidebarComponent from "./Sidebar";
import { useRouter } from "next/navigation";
import { useChatHistoryStore } from "@/store/chatHistoryStore";
import { useSession } from "next-auth/react";
import { getHistory } from "@/api/history";
import toast from "react-hot-toast";
export default function ChatSidebar() {
  const { data, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const history = useChatHistoryStore((state) => state.history);
  const setHisory = useChatHistoryStore((state) => state.setHistory);
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
            router.push("/auth/signin");
          }, 3000);
        }
      }
    };
    fetchHistory();
  }, [status]);
  return (
    <div className="relative w-12 h-full border-r border-white/5 flex p-2 pt-0 items-center flex-col gap-6">
      <span onClick={() => setOpen(true)} title="Open Sidebar" className="mt-4">
        <Sidebar className="text-white/50 cursor-pointer" />
      </span>

      <span onClick={() => router.push("/chat")} title="New Chat">
        <Plus
          size={26}
          className="hover:bg-button-bg hover:scale-105 transition-all duration-500 cursor-pointer rounded-full bg-[#4a4a4a] p-1"
        />
      </span>
      <SidebarComponent history={history} open={open} setOpen={setOpen} />
    </div>
  );
}
