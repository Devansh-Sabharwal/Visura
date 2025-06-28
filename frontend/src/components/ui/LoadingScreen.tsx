import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const waitingMessages = [
  "Loading",
  "Preparing",
  "Almost ready",
  "Just a moment",
];

export function Loading() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState("");
  // Cycle through waiting messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
    }, 2500);

    return () => clearInterval(messageInterval);
  }, [waitingMessages.length]);

  // Animate dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full opacity-[0.02] blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Enhanced spinner */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin opacity-80" />
            <div className="absolute inset-0 w-8 h-8 sm:w-12 sm:h-12 border-2 border-gray-800 border-t-white/20 rounded-full animate-spin-slow"></div>
          </div>
        </div>

        {/* Animated text with smooth transitions */}
        <div className="space-y-6">
          <h1 className="text-lg sm:text-2xl text-white font-light tracking-wide transition-all duration-500 ease-in-out">
            {waitingMessages[currentMessageIndex]}
            <span className="text-gray-400 ml-1 inline-block w-6 text-left">
              {dots}
            </span>
          </h1>

          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>

          <p className="text-gray-500 text-xs sm:text-sm font-light">
            Please wait
          </p>
        </div>

        {/* Minimal floating dots */}
        <div className="mt-16 flex justify-center space-x-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.4}s`,
                animationDuration: "2s",
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
