import { DemoVideoSection } from "@/components/Landing/DemoVideo";
import Features from "@/components/Landing/Features";
import { HeroSection } from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";

export default function page() {
  return (
    <div className="bg-[#040110] font-inter">
      <div className="overflow-hidden relative">
        <HeroSection />
      </div>
      <DemoVideoSection />
      <HowItWorks />
      <Features />
    </div>
  );
}
