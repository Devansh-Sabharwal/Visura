import { ChatHistory } from "@/types/chatHistory";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
interface SidebarProps {
  translate?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  history: ChatHistory[];
}
export default function Sidebar({
  open,
  setOpen,
  translate,
  history,
}: SidebarProps) {
  const router = useRouter();
  const handleClick = (chatId: string) => {
    window.location.href = `/chat/${chatId}`;
  };
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, setOpen]);

  return (
    <div
      ref={divRef}
      onClick={() => {}}
      className={`${
        open ? (translate ? translate : "translate-x-28") : "-translate-x-100"
      } transition-all duration-400 absolute border p-4 border-white/10 rounded-lg w-72 h-full bg-black-200`}
    >
      <div className="flex w-full justify-end">
        <X
          className="cursor-pointer"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <div
        onClick={() => {
          router.push("/chat");
        }}
        className="text-sm bg-button-bg hover:scale-105 transition-all duration-500 cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 mt-4"
      >
        Create New Chat
      </div>
      <div className="mt-12 text-white/70">Recent chats</div>
      <div className="overflow-auto max-h-[calc(100vh-250px)] py-2 custom-scrollbar">
        {history.map((element, index) => (
          <div
            onClick={() => handleClick(element.chatId)}
            key={index}
            className="rounded-lg hover:bg-[#383838] cursor-pointer px-2 py-1 text-base text-white/60 my-2"
          >
            {element.title}
          </div>
        ))}
      </div>
    </div>
  );
}
