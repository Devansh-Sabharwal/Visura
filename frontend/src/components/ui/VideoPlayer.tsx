import { ArrowDown } from "lucide-react";

export default function VideoPlayer({ url }: { url: string }) {
  const handleDownload = () => {};
  return (
    <div className="w-full h-full flex flex-col items-center">
      <video
        controls
        preload="metadata"
        autoPlay
        className="mt-4 w-full h-[500px]"
      >
        <source
          src={
            "https://res.cloudinary.com/dbyfsythn/video/upload/v1750603202/manim_videos/manim_videos/testing/62701215.mp4"
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="flex justify-end w-[95%]">
        <button
          onClick={handleDownload}
          className="mt-4 hover:scale-105 hover:bg-blue-500 transition-all duration-500 cursor-pointer py-2 px-4 text-sm rounded-lg flex items-center gap-2 bg-blue-500/80"
        >
          <span>Download</span>
          <ArrowDown className="text-sm" />
        </button>
      </div>
    </div>
  );
}
