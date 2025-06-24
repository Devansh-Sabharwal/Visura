import { useChatStore } from "@/store/chatStore";
import { useParams } from "next/navigation";
import React from "react";
import ChatWindow from "./ChatWindow";
import AnimationWindow from "./AnimationWindow";
import ChatSidebar from "./ChatSidebar";
import Navbar from "./Navbar";

export default function ChatInterface() {
  const { chatId } = useParams();
  const setMessages = useChatStore((state) => state.setMessages);
  const messages = useChatStore((state) => state.messages);

  return (
    <div className="flex flex-col h-screen font-inter tracking-wide">
      <div>
        <Navbar />
      </div>
      <div className="flex-1 mb-2 flex w-screen h-full overflow-y-auto">
        <div className="flex-1 flex h-full w-full">
          <div>
            <ChatSidebar />
          </div>
          <div className="bg-black-100 h-full flex-1">
            <ChatWindow />
          </div>
          <div className="bg-black-100  h-full flex-2 flex flex-col ml-3 ">
            <div className=" flex-1 border bg-[#171717] mt-4 border-white/10 rounded-xl h-full">
              <AnimationWindow />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
