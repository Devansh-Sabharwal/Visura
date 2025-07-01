"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
} from "lucide-react";

export function DemoVideoSection() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const demoVideos = [
    {
      id: 0,
      title: "How Visura Works",
      prompt: "Create a animation on web3 private pubic key cryptography",
      thumbnail: "thumbnail00.png",
      videoUrl: "/demo.mp4",
    },
    {
      id: 1,
      title: "Greetings Animation ",
      prompt:
        "Flash greetings in different languages one after another instantly making a fast greeting Animation",
      thumbnail: "thumbnail01.png",
      videoUrl:
        "https://res.cloudinary.com/dbyfsythn/video/upload/v1750595726/manim_videos/manim_videos/testing/93b49190.mp4",
    },
    {
      id: 2,
      title: "LLM explanation",
      prompt: "Explain How LLM's work through animation",
      thumbnail: "thumbnail02.png",
      videoUrl:
        "https://res.cloudinary.com/dbyfsythn/video/upload/v1751122910/manim_videos/manim_videos/test-frontend/974e3436.mp4",
    },
    {
      id: 3,
      title: "Bubble Sort Simulation",
      prompt: "Animate Bubble Sort Sorting alogrithm",
      thumbnail: "/thumbnail03.png",
      videoUrl:
        "https://res.cloudinary.com/dbyfsythn/video/upload/v1751193630/manim_videos/manim_videos/test-frontend/21b94545.mp4",
    },
    {
      id: 4,
      title: "Pythogoras Theorem Proof",
      prompt: "Proof pythogoras theorem",
      thumbnail: "/thumbnail04.png",
      videoUrl:
        "https://res.cloudinary.com/dbyfsythn/video/upload/v1751401880/manim_videos/manim_videos/test-frontend/73f0911c.mp4",
    },
  ];

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % demoVideos.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideo(
      (prev) => (prev - 1 + demoVideos.length) % demoVideos.length
    );
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentVideo]);

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6">
        {/* Main Video Player */}
        <div className="mb-12">
          <div className="relative border border-white/10 backdrop-blur-xl rounded-3xl p-2 sm:p-4 shadow-2xl">
            {/* Video Container */}
            <div className="relative sm:aspect-video bg-black rounded-2xl overflow-hidden group">
              <video
                ref={videoRef}
                src={demoVideos[currentVideo].videoUrl}
                poster={demoVideos[currentVideo].thumbnail}
                className="w-full h-full object-cover"
              />

              {/* Video Overlay */}
              {
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
                  {/* Play Controls */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="absolute transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white " />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevVideo}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={nextVideo}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              }

              {/* Video Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-2xl font-medium sm:tracking-tighter text-white sm:mb-2">
                      {demoVideos[currentVideo].title}
                    </h3>
                    <p className="hidden sm:block tracking-tight text-green-700 text-sm max-w-2xl">
                      <span>Prompt : </span>
                      {demoVideos[currentVideo].prompt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {demoVideos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => {
                setCurrentVideo(index);
                setIsPlaying(false);
              }}
              onMouseEnter={() => setHoveredVideo(index)}
              onMouseLeave={() => setHoveredVideo(null)}
              className={`relative group transition-all duration-300 ${
                currentVideo === index
                  ? "ring-2 ring-white/20 p-2 scale-105"
                  : "hover:scale-105"
              }`}
            >
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mt-2 text-left">
                <h4
                  className={`text-xs sm:text-sm font-medium ${
                    currentVideo === index
                      ? "text-purple-300"
                      : "text-white group-hover:text-purple-300"
                  }`}
                >
                  {video.title}
                </h4>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
