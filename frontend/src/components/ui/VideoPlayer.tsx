export default function VideoPlayer({ url }: { url: string }) {
  return (
    <video
      controls
      autoPlay
      loop
      className="rounded-lg w-full max-w-xl shadow-lg"
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
