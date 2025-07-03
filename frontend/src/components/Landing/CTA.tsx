import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="relative flex justify-center bg-[url('/inverted-section-bg.png')] items-center min-h-screen bg-center bg-cover ">
      <div>
        <div className="text-center tracking-[-0.08em] text-3xl  sm:text-4xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Bring Your Ideas to Life in Seconds
        </div>
        <div className="mt-3 text-center tracking-[-0.04em] text-lg text-gray-400">
          Prompt. Play. Perfect.
        </div>
        <div className="flex justify-center">
          <Link
            href="/signup"
            style={{
              background:
                "linear-gradient(to bottom, rgb(139, 85, 255) 0%, rgb(55, 63, 224) 100%)",
            }}
            className="mx-6 w-full sm:w-fit text-center mt-12 sm:mt-16 hover:scale-105 rounded-xl sm:rounded-xl text-sm sm:text-lg text-white px-6 py-4 cursor-pointer transition-all duration-300"
          >
            Animate Now
          </Link>
        </div>
      </div>
    </div>
  );
}
