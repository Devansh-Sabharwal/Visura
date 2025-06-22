import { Tabs } from "./ui/Tabs";
import CodeBlock from "./ui/CodeBlock";
import VideoPlayer from "./ui/VideoPlayer";
export default function AnimationWindow() {
  const demo = "def main:";
  const tabs = [
    {
      title: "Code",
      value: "Code",
      content: (
        <div className="h-full">
          <CodeBlock code={demo} language="python" />
        </div>
      ),
    },
    {
      title: "Animation",
      value: "Animation",
      content: (
        <div>
          <VideoPlayer url="https://player.cloudinary.com/embed/?cloud_name=dbyfsythn&public_id=manim_videos%2Fmanim_videos%2Ftest-frontend%2F032a20f6&profile=cld-default" />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="py-2 h-full">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
