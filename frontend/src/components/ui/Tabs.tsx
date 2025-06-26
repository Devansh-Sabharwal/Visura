"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useActiveTabStore } from "@/store/activeTabStore";

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
  const activeTabValue = useActiveTabStore((state) => state.activeTab);
  const setActiveTabValue = useActiveTabStore((state) => state.setActiveTab);

  // Update active tab when tabs change (important fix!)
  useEffect(() => {
    // If current active tab doesn't exist in new tabs, reset to first tab
    const currentTabExists = tabs.some((tab) => tab.value === activeTabValue);
    if (!currentTabExists && tabs.length > 0) {
      setActiveTabValue(tabs[0].value);
    }
  }, [tabs, activeTabValue]);

  // Find the current active tab from the latest tabs array
  const activeTab = tabs.find((tab) => tab.value === activeTabValue) || tabs[0];

  return (
    <div className="w-full h-full flex-col flex">
      <div
        className={cn(
          "flex gap-1 items-center px-2 pb-1 border-b border-white/10",
          containerClassName
        )}
      >
        <div className="space-x-4 py-2 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTabValue(tab.value)}
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
