import { useChatStore } from "@/store/chatStore";
import Input from "./ui/InputBox";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ui/ChatBubble";
import { useCodeStore } from "@/store/codeStore";
import { usePromptStore } from "@/store/promptStore";

export default function ChatWindow() {
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const setLoading = useChatStore((state) => state.setLoading);
  const loading = useChatStore((state) => state.isLoading);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const setCode = useCodeStore((state) => state.setCode);
  const prompt = usePromptStore((state) => state.prompt);
  const setPrompt = usePromptStore((state) => state.setPrompt);
  const handleSubmit = () => {
    if (prompt.trim() == "") return;
    const newMessages = [
      ...messages,
      { role: "user", content: prompt, timestamp: Date.now().toString() },
    ];
    setPrompt("");
    setMessages(newMessages);
    setLoading(true);
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "model") {
        try {
          const content = JSON.parse(messages[i].content);
          if (content?.code) {
            setCode(content.code.trim());
            return;
          }
        } catch (err) {
          alert("error in parsing code");
        }
      }
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
        {loading && <div className="flex justify-start">...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="mx-2">
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
