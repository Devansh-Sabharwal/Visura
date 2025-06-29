import { useCodeStore } from "@/store/codeStore";
import { useAnimationStore } from "@/store/animationStore";
import { useActiveTabStore } from "@/store/activeTabStore";
import { ChevronRight } from "lucide-react";
import React from "react";

interface Props {
  role: string;
  text: string;
  videoUrl?: string;
}

export default function ChatBubble({ role, text, videoUrl }: Props) {
  const setCode = useCodeStore((state) => state.setCode);
  const setVideoUrl = useAnimationStore((state) => state.setVideoUrl);
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);
  let code: string = "";

  const handleAnimationClick = () => {
    setActiveTab("Animation");
    setCode(code.trim());
    setVideoUrl(videoUrl || "");
  };
  let explanation: string = "";

  if (role === "model") {
    try {
      const data = JSON.parse(text);
      explanation = data.explanation || "";
      code = data.code || "";
    } catch {
      code = text;
    }
  }

  return (
    <div
      className={`${
        role === "user" ? "bg-[#434343]" : "bg-none "
      } text-white text-sm rounded-lg px-4 py-2 max-w-[400px] overflow-auto custom-scrollbar w-fit leading-6`}
    >
      <p className="whitespace-pre-wrap">
        {role == "user" ? text : explanation}
      </p>
      {role == "model" && code.trim() != "" && videoUrl && videoUrl.trim() && (
        <div
          onClick={handleAnimationClick}
          className="flex items-center justify-between mt-1 bg-none px-3 py-2 border border-white/20 cursor-pointer rounded-lg"
        >
          <div className="text-xs p-1 border-white/30">View Animation</div>
          <ChevronRight className="text-white/80" size={20} />
        </div>
      )}
    </div>
  );
}
