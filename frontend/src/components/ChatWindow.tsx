import { useChatStore } from "@/store/chatStore";
import Input from "./ui/InputBox";
import { useEffect, useRef } from "react";
import ChatBubble from "./ui/ChatBubble";
import { useCodeStore } from "@/store/codeStore";
import { usePromptStore } from "@/store/promptStore";
import { fetchPromptStream } from "@/api/prompt";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import { useAnimationStore } from "@/store/animationStore";
import { useActiveTabStore } from "@/store/activeTabStore";
import { useSessionStore } from "@/store/sessionStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ChatWindow() {
  const router = useRouter();
  const { fastApiToken } = useSessionStore();
  const chatId = useChatStore((state) => state.chatId);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const setLoading = useChatStore((state) => state.setLoading);
  const loading = useChatStore((state) => state.isLoading);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const setCode = useCodeStore((state) => state.setCode);
  const prompt = usePromptStore((state) => state.prompt);
  const setPrompt = usePromptStore((state) => state.setPrompt);
  const setRequestId = useAnimationStore((state) => state.setRequestId);
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);

  const handleSubmit = async () => {
    if (prompt.trim() == "") return;
    try {
      const temp = prompt;
      setPrompt("");
      await fetchPromptStream({
        prompt: temp,
        chatId: chatId || "",
        token: fastApiToken || "",
        messages,
        setMessages,
        setPrompt,
        setCode,
        setLoading,
        setRequestId,
        setActiveTab,
      });
    } catch (e: any) {
      if (e.message == "Unauthorized") {
        toast.error("Session expired. Please sign in again.");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar pt-4 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mx-2 my-1`}
          >
            <ChatBubble
              role={msg.role}
              text={msg.content}
              videoUrl={msg.videoUrl}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-center mt-1">
            <span className="text-white">
              <BeatLoader color="white" size={12} />
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mx-1 sm:mx-2">
        <Input
          disabled={loading}
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
