"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
};

export const Tabs = ({
  tabs,
  containerClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

  return (
    <div className="w-full h-full flex-col flex">
      <div
        className={cn(
          "flex gap-1 items-center px-2 pb-1 border-b border-white/10",
          containerClassName
        )}
      >
        <div className="space-x-4  py-2 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 cursor-pointer rounded-md text-sm font-medium transition-all ",
                activeTab.value === tab.value
                  ? "bg-button-bg text-white"
                  : " text-white/80 hover:bg-[#2b2b2b]",
                tabClassName
              )}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className={cn("h-full", contentClassName)}>{activeTab.content}</div>
    </div>
  );
};
