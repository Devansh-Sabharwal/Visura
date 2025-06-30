import { Navbar } from "@/components/ui/Landing/Navbar";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="h-screen w-screen">
      <div className="absolute inset-0 -scale-y-100 hero-gradient z-0"></div>
      <div
        className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)]
      sm:bg-[size:60px_60px]
      "
      ></div>
      <Navbar />

      <div className="relative z-10 mt-24 sm:mt-28">
        <div className="flex justify-center font-inter text-white tracking-tighter sm:tracking-[-0.08em]">
          <div className="flex flex-col gap-4 items-center sm:gap-0 text-center font-medium text-[40px] sm:text-[80px]">
            <div className="bg-gradient-to-r leading-tight from-white to-gray-500 bg-clip-text text-transparent">
              From Thought to
            </div>
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Frame in Seconds
            </div>
            <div className="text-gray-300 mt-4 sm:mt-8 font-normal text-sm sm:text-xl tracking-normal sm:tracking-[-0.03em]">
              Say it. See it. Animate it. All with Visura's AI
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-12 sm:mt-8 flex gap-6 sm:gap-8 z-10 text-white justify-center">
        <Link
          href="/signup"
          className="flex items-center text-base sm:text-lg rounded-xl px-5 sm:px-6 py-3 sm:py-3 bg-[#493282] 
             border-2 border-transparent /* Ensures layout stability */
             shadow-[inset_0_0_10px_2px_rgba(255,255,255,0.7)]
             hover:scale-110 transition-all duration-300"
        >
          Get Started
        </Link>
        <Link
          href={"/"}
          className="hover:scale-110 transition-all duration-300 flex items-center text-sm sm:text-lg rounded-xl px-3 sm:px-6  py-1.5 sm:py-3 border"
        >
          Explore Examples
        </Link>
      </div>
    </div>
  );
}
