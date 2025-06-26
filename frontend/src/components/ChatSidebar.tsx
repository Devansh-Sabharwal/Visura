import { Plus, Sidebar } from "lucide-react";
import React, { useState } from "react";
import SidebarComponent from "./Sidebar";
import { useRouter } from "next/navigation";
export default function ChatSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
      <SidebarComponent open={open} setOpen={setOpen} />
    </div>
  );
}
