import { MessageSquare, Sparkles, Download } from "lucide-react";
export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: MessageSquare,
      title: "Describe Your Vision",
      description:
        "Describe what you want to animate, or ask follow-up questions to fine-tune it to your vision.",
    },
    {
      id: 2,
      icon: Sparkles,
      title: "Visura Magic",
      description:
        "Watch as our advanced AI transforms your description into professional-grade 2D animations",
    },
    {
      id: 3,
      icon: Download,
      title: "Download & Share",
      description:
        "Download your animation in MP4 format, ready to share across platforms",
    },
  ];
  return (
    <div className="min-h-screen overflow-hidden bg-[url('/section-bg.png')] flex justify-center items-center bg-cover bg-center bg-no-repeat ">
      <div>
        <div className="text-center font-medium sm:mt-32 pt-10 pb-8 text-3xl sm:text-5xl font-inter tracking-[-0.08em]">
          How Visura works
        </div>
        <div className="flex flex-col gap-4 sm:gap-0 items-center sm:flex-row justify-between w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              step={step}
              index={index}
              totalSteps={steps.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface HowItWorksCardProps {
  step: {
    id: number;
    icon: React.ComponentType<any>;
    title: string;
    description: string;
  };
  index: number;
  totalSteps: number;
}

export function Card({ step }: HowItWorksCardProps) {
  const Icon = step.icon;

  return (
    <div className="relative group">
      <div className="border border-white/10 sm:border-white/20 w-[320px] h-72 sm:h-84 bg-black/50 sm:bg-black/30 rounded-2xl transition-all duration-500 cursor-pointer hover:scale-105">
        <div className="p-6 sm:p-8 h-full flex flex-col">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-r  flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300`}
          >
            <Icon className={`w-8 h-8 sm:w-10 sm:h-10 text-indigo-300/60`} />
          </div>

          <div className="flex-1 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl tracking-tighter font-medium bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent leading-tight">
                {step.title}
              </h3>
            </div>

            {/* Description */}
            <p className="mt-3 sm:mt-8 text-slate-400 leading-relaxed text-sm sm:text-base">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
