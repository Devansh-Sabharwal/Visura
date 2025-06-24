import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputBox from "./ui/InputBox";
import { usePromptStore } from "@/store/promptStore";
import Suggestion from "./ui/Suggestion";
import { Sidebar } from "lucide-react";
import SidebarComponent from "./Sidebar";

export default function NewChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const prompt = usePromptStore((state) => state.prompt);
  const setPrompt = usePromptStore((state) => state.setPrompt);
  return (
    <div className="h-screen w-screen angular-gradient overflow-auto px-4 sm:px-4">
      <SidebarComponent open={open} setOpen={setOpen} />

      <div className="h-fit px-2 sm:px-4 py-8 flex justify-between">
        <div className="flex px-2 sm:px-6 items-center">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="hover:cursor-pointer"
          >
            <img src="/logo2.svg" alt="Logo" className="h-6 sm:h-[40px]" />
          </div>
        </div>
        <button className="mr-2 hover:scale-105 transition-all duration-500 px-3 py-1 rounded-lg cursor-pointer border border-white/50">
          Logout
        </button>
      </div>
      <div className="w-full flex justify-center text-center mt-20 sm:mt-44">
        <div>
          <div className="font-inter  font-semibold tracking-[-0.08em] text-3xl sm:text-[44px]">
            What would you like to animate?
          </div>
          <div className="mt-1.5 font-normal text-center font-sans tracking-[-0.03em] text-base sm:text-xl text-[#CBCBCB]">
            Create stunning 2D animations by chatting with AI.
          </div>
          <div className="mt-8 flex justify-center">
            <InputBox className="bg-[#9C9999]/10 border w-[360px] sm:w-md flex border-white/40 rounded-lg h-32 justify-end p-4" />
          </div>
        </div>
      </div>
      <div className="max-w-2xl mt-20 flex justify-center mx-auto flex-wrap">
        <Suggestion text="Draw a geometric design" />
        <Suggestion text="Proof pythogoras theorem" />
        <Suggestion text="Explain black holes through animations" />
        <Suggestion text="Make a geometric design animation" />
        <Suggestion text="Draw a flowchart of water cycle" />
      </div>
      <div className="absolute bottom-4 left-2">
        <span onClick={() => setOpen(true)} title="Open Sidebar">
          <Sidebar className="text-white/50 cursor-pointer" />
        </span>
      </div>
    </div>
  );
}
