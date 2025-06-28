import { ArrowDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loading } from "./LoadingScreen";

export default function VideoPlayer({
  url,
  loading,
}: {
  url: string;
  loading: boolean;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "animation.mp4"; // Customize filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };
  if (loading)
    return (
      <>
        <Loading />
      </>
    );
  if (!url?.trim()) {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg">
        <p className="flickering-text">Your Animation will render here</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <video
        controls
        preload="metadata"
        autoPlay
        className="mt-4 w-full h-[500px]"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="flex justify-end w-[95%]">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`mt-4 hover:scale-105 transition-all duration-500 cursor-pointer py-2 px-4 text-sm rounded-lg flex items-center gap-2 ${
            isDownloading
              ? "bg-gray-400 cursor-not-allowed hover:scale-100"
              : "bg-blue-500/80 hover:bg-blue-500"
          }`}
        >
          <span>{isDownloading ? "Downloading..." : "Download"}</span>
          <ArrowDown
            className={`text-sm ${isDownloading ? "animate-bounce" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
