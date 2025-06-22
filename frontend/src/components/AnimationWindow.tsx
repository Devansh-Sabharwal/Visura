import { Tabs } from "./ui/Tabs";
import CodeBlock from "./ui/CodeBlock";
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
      content: <div>animation</div>,
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
