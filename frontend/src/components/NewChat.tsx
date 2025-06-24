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
    <div className="h-screen w-screen angular-gradient overflow-hidden px-2">
      <SidebarComponent open={open} setOpen={setOpen} />

      <div className="h-[56px] px-4 py-8">
        <div className="h-full flex p-6 items-center">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="hover:cursor-pointer"
          >
            <img src="/logo2.svg" alt="Logo" className="h-[40px]" />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-44">
        <div>
          <div className="font-inter font-semibold tracking-[-0.08em] text-[44px]">
            What would you like to animate?
          </div>
          <div className="mt-1.5 font-normal text-center font-sans tracking-[-0.03em] text-xl text-[#CBCBCB]">
            Create stunning 2D animations by chatting with AI.
          </div>
          <div className="mt-8 flex justify-center">
            <InputBox className="bg-[#9C9999]/10 border w-md flex border-white/40 rounded-lg h-32 justify-end p-4" />
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
      <div>
        <span
          onClick={() => setOpen(true)}
          title="Open Sidebar"
          className="mt-4"
        >
          <Sidebar className="text-white/50 cursor-pointer" />
        </span>
      </div>
    </div>
  );
}
