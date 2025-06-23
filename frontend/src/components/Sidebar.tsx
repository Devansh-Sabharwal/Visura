import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Sidebar({ open, setOpen }: SidebarProps) {
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
        open ? "translate-x-28" : "-translate-x-100"
      } transition-all duration-400 absolute border p-4 border-white/10 rounded-lg w-72 h-full bg-black-200`}
    >
      <div className="flex w-full justify-end">
        <X
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <div className="text-sm bg-button-bg hover:scale-105 transition-all duration-500 cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 mt-4">
        Create New Chat
      </div>
      <div className="mt-12 text-white/70">Recent chats</div>
      <div className="overflow-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
        {/* map kro yaha */}
      </div>
    </div>
  );
}
