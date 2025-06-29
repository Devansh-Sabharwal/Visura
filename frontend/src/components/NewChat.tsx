"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InputBox from "./ui/InputBox";
import { usePromptStore } from "@/store/promptStore";
import Suggestion from "./ui/Suggestion";
import { Sidebar } from "lucide-react";
import SidebarComponent from "./Sidebar";
import { v4 as uuidv4 } from "uuid";
import { useChatHistoryStore } from "@/store/chatHistoryStore";
import { getHistory } from "@/api/history";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useIsMobile } from "@/store/isMobileStore";
export default function NewChat() {
  const { data, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const prompt = usePromptStore((state) => state.prompt);
  const setIsMobile = useIsMobile((state) => state.setIsMobile);
  const setPrompt = usePromptStore((state) => state.setPrompt);
  const history = useChatHistoryStore((state) => state.history);
  const setHisory = useChatHistoryStore((state) => state.setHistory);
  const onSubmit = () => {
    if (prompt?.trim() == "") return;
    const chatId = uuidv4();
    // router.push(`/chat/${chatId}`);
    console.log("onSubmit called", prompt);
    router.push(`/chat/test-frontend`);
  };
  //fetch history
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className="h-screen w-screen angular-gradient overflow-auto px-4 sm:px-4">
      <SidebarComponent
        history={history}
        translate={"0"}
        open={open}
        setOpen={setOpen}
      />

      <div className="h-fit sm:px-4 py-4 sm:py-8 flex justify-between">
        <div className="flex sm:px-6 items-center">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="hover:cursor-pointer"
          >
            <img src="/logo2.svg" alt="Logo" className="h-6 sm:h-[40px]" />
          </div>
        </div>
        <button
          onClick={() => {
            const handleLogout = async () => {
              await signOut({
                callbackUrl: "/auth/signin", // Optional: redirect after logout
              });
            };

            if (!data) return null;
            handleLogout();
          }}
          className="mr-2 hover:scale-110 transition-all duration-500 px-3 py-1 rounded-lg cursor-pointer border border-white/60"
        >
          Logout
        </button>
      </div>
      <div className="w-full flex justify-center text-center mt-32 sm:mt-44">
        <div>
          <div className="font-inter  font-semibold tracking-[-0.08em] text-3xl sm:text-[44px]">
            What would you like to animate?
          </div>
          <div className="mt-1.5 font-normal text-center font-sans tracking-[-0.04em] text-base sm:text-xl text-[#CBCBCB]">
            Create stunning 2D animations by chatting with AI.
          </div>
          <div className="mt-8 flex justify-center">
            <InputBox
              disabled={false}
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={onSubmit}
              buttonClassName="sm:hidden bg-[#3A5761]"
              className="bg-[#9C9999]/10 border w-[340px] sm:w-md flex border-white/20 rounded-lg h-32 justify-end p-4"
            />
          </div>
        </div>
      </div>
      <div className="max-w-2xl mt-20 flex justify-center mx-auto flex-wrap">
        <Suggestion text="Animate the fibonacci spiral being built block by block" />
        <Suggestion text="Proof pythogoras theorem" />
        <Suggestion text="Explain black holes through animations" />
        <Suggestion text="Make a geometric design animation" />
        <Suggestion text="Draw a flowchart of water cycle" />
      </div>
      <div className="absolute bottom-4 left-2">
        <span title="Open Sidebar">
          {!open && (
            <Sidebar
              onClick={(e) => {
                e.preventDefault();
                setOpen((prev) => !prev);
              }}
              className="text-white/50 cursor-pointer"
            />
          )}
        </span>
      </div>
    </div>
  );
}
