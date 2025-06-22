import { Tabs } from "./ui/Tabs";
import CodeBlock from "./ui/CodeBlock";
import VideoPlayer from "./ui/VideoPlayer";
export default function AnimationWindow() {
  const demo =
    "from manim import *\nimport numpy as np\n\nclass MainScene(Scene):\n    def construct(self):\n        # 1. Central point\n        central_dot = Dot(ORIGIN, radius=0.08, color=WHITE)\n        self.play(Create(central_dot), run_time=0.8)\n        self.wait(0.2)\n\n        # 2. Expanding concentric circles\n        circle1 = Circle(radius=1, color=BLUE)\n        circle2 = Circle(radius=2, color=GREEN)\n        circle3 = Circle(radius=3, color=YELLOW)\n        circles = VGroup(circle1, circle2, circle3)\n\n        self.play(LaggedStart(*[Create(c) for c in circles], lag_ratio=0.2), run_time=2)\n        self.wait(0.5)\n\n        # 3. Radial lines (beams)\n        radial_lines = VGroup()\n        num_lines = 12\n        for i in range(num_lines):\n            angle = i * (2 * PI / num_lines)\n            line = Line(ORIGIN, 3 * np.array([np.cos(angle), np.sin(angle), 0]), color=GRAY)\n            radial_lines.add(line)\n\n        self.play(LaggedStart(*[Create(l) for l in radial_lines], lag_ratio=0.05), run_time=2)\n        self.wait(0.5)\n\n        # 4. Circular array of shapes (petals/squares)\n        num_petals = 8\n        petal_radius = 1.8\n        petals = VGroup()\n        for i in range(num_petals):\n            angle = i * (2 * PI / num_petals)\n            pos = petal_radius * np.array([np.cos(angle), np.sin(angle), 0])\n            petal = Square(side_length=0.4, color=RED, fill_opacity=0.8).move_to(pos)\n            petals.add(petal)\n\n        self.play(LaggedStart(*[Create(p) for p in petals], lag_ratio=0.1), run_time=2)\n        self.wait(0.5)\n\n        # 5. Connecting lines for star effect\n        star_lines = VGroup()\n        for i in range(num_petals):\n            start_petal_center = petals[i].get_center()\n            end_petal_center = petals[(i + 1) % num_petals].get_center()\n            line = Line(start_petal_center, end_petal_center, color=ORANGE)\n            star_lines.add(line)\n\n        self.play(LaggedStart(*[Create(sl) for sl in star_lines], lag_ratio=0.08), run_time=1.5)\n        self.wait(0.5)\n\n        # 6. Group all elements and perform overall rotation and color change\n        design = VGroup(central_dot, circles, radial_lines, petals, star_lines)\n\n        self.play(\n            Rotate(design, angle=PI/2, about_point=ORIGIN, run_time=2.5),\n            design.animate.set_color(PINK),\n            run_time=2.5\n        )\n        self.wait(0.5)\n\n        # 7. Fade out the entire design\n        self.play(FadeOut(design), run_time=1.5)\n        self.wait(1)";
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
