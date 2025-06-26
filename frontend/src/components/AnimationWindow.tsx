// Simplified AnimationWindow.tsx
import { Tabs } from "./ui/Tabs";
import CodeBlock from "./ui/CodeBlock";
import VideoPlayer from "./ui/VideoPlayer";
import { useCodeStore } from "@/store/codeStore";

export default function AnimationWindow() {
  const { code } = useCodeStore();

  const tabs = [
    {
      title: "Code",
      value: "Code",
      content: (
        <div className="h-full">
          <CodeBlock code={code || ""} language="python" />
        </div>
      ),
    },
    {
      title: "Animation",
      value: "Animation",
      content: (
        <div className="h-full">
          <VideoPlayer />
        </div>
      ),
    },
  ];

  return (
    <div className="py-2 h-full">
      <Tabs tabs={tabs} />
    </div>
  );
}
