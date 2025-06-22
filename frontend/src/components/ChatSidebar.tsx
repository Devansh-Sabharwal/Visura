import { Plus, Sidebar } from "lucide-react";
import React from "react";

export default function ChatSidebar() {
  return (
    <div className="w-12 h-full border-r border-white/5 flex p-2 items-center flex-col gap-6">
      <span title="Open Sidebar" className="mt-4">
        <Sidebar className="text-white/50 cursor-pointer" />
      </span>
      <span title="New Chat">
        <Plus
          size={26}
          className="hover:bg-[#5a5a5a] hover:scale-105 transition-all duration-500 cursor-pointer rounded-full bg-[#4a4a4a] p-1"
        />
      </span>
    </div>
  );
}
