import { Navbar } from "@/components/Landing/Navbar";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 -scale-y-100 hero-gradient z-0"></div>
      <div
        className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)]
      sm:bg-[size:60px_60px]
      "
      ></div>
      <Navbar />

      <div className="relative z-10 mt-24 text-7xl">
        <div className="flex justify-center font-inter text-white tracking-tighter sm:tracking-[-0.08em]">
          <div className="flex flex-col gap-2 items-center sm:gap-0 text-center font-medium text-[46px] sm:text-[80px]">
            <div className="bg-gradient-to-r leading-tight from-white to-gray-500 bg-clip-text text-transparent">
              From Thought to
            </div>
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Frame in Seconds
            </div>
            <div className="text-gray-300 mt-2 sm:mt-8 font-normal text-sm sm:text-xl tracking-normal sm:tracking-[-0.03em]">
              {`Say it. See it. Animate it. All with Visura's AI`}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-12 sm:mt-8 flex flex-col items-center sm:flex-row gap-6 sm:gap-8 z-10 text-white justify-center">
        <Link
          href="/signup"
          className="flex w-72 sm:w-fit justify-center items-center text-base sm:text-lg rounded-xl px-5 sm:px-6 py-3 sm:py-3 transition-all duration-300"
          style={{
            background:
              "linear-gradient(to bottom, rgb(139, 85, 255) 0%, rgb(55, 63, 224) 100%)",
          }}
        >
          Get Started
        </Link>
        <Link
          href={"/#demo"}
          className=" w-72 sm:w-fit transition-all justify-center duration-300 flex items-center text-sm sm:text-lg rounded-xl px-3 sm:px-6 py-3 sm:py-3 border"
        >
          Explore Examples
        </Link>
      </div>
    </div>
  );
}
