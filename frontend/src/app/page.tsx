import { DemoVideoSection } from "@/components/Landing/DemoVideo";
import { HeroSection } from "@/components/Landing/Hero";

export default function page() {
  return (
    <div className="bg-[#0a0812] font-inter">
      <div className="overflow-hidden relative">
        <HeroSection />
      </div>
      <DemoVideoSection />
    </div>
  );
}
