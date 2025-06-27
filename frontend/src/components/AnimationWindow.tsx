import { Tabs } from "./ui/Tabs";
import CodeBlock from "./ui/CodeBlock";
import VideoPlayer from "./ui/VideoPlayer";
import { useCodeStore } from "@/store/codeStore";
import { useAnimationPolling } from "@/hooks/useAnimationPolling";
import { useAnimationStore } from "@/store/animationStore";

export default function AnimationWindow() {
  const { code } = useCodeStore();
  const requestId = useAnimationStore((state) => state.requestId);
  const videoUrl = useAnimationStore((state) => state.videoUrl);
  const { loading } = useAnimationPolling(requestId || "");
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
        <div key={videoUrl} className="h-full">
          <VideoPlayer loading={loading} url={videoUrl} />
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
