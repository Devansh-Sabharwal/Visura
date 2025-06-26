import { useChatStore } from "@/store/chatStore";
import Input from "./ui/InputBox";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ui/ChatBubble";

export default function ChatWindow() {
  const chatId = useChatStore((state) => state.chatId);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const handleSubmit = () => {
    if (prompt.trim() == "") return;
    const newMessages = [
      ...messages,
      { role: "user", content: prompt, createdAt: Date.now().toString() },
    ];
    setPrompt("");
    setMessages(newMessages);
    setIsThinking(true);
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
            <ChatBubble role={msg.role} text={msg.content} />
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <ChatBubble role="assistant" text="..." />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mx-2">
        <Input prompt={prompt} setPrompt={setPrompt} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
