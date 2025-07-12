export type Message = {
  role: string;
  content: string;
  timestamp: string;
  videoUrl?: string;
};

export type MessageResponse = {
  role: string;
  content: string;
  timestamp: string;
  video_url: string;
};
