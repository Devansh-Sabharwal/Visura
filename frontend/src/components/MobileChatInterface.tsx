import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import AnimationWindow from "./AnimationWindow";
import ChatSidebar from "./ChatSidebar";
import Navbar from "./Navbar";
import { useActiveTabStore } from "@/store/activeTabStore";

export default function MobileChatInterface() {
  const mobileActiveTab = useActiveTabStore((state) => state.mobileActiveTab);
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
          {mobileActiveTab == "Chat" && (
            <div className="bg-black-100 h-full max-w-[calc(100vw-60px)] w-full">
              <ChatWindow />
            </div>
          )}
          {mobileActiveTab == "Animation" && (
            <div className="bg-black-100  h-full w-full flex flex-col ml-1 sm:ml-3 ">
              <div className=" flex-1 border bg-[#171717] mt-4 border-white/10 rounded-xl h-full">
                <AnimationWindow />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
