"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { Send, Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import NewChat from "./NewChat";

export default function Input() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [code, setCode] = useState("");
  const [currentSection, setCurrentSection] = useState<
    "explanation" | "code" | null
  >(null);
  const chatId = useChatStore((state) => state.chatId);
  const { data } = useSession();

  // Refs for auto-scrolling
  const explanationRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (currentSection === "explanation" && explanationRef.current) {
      explanationRef.current.scrollTop = explanationRef.current.scrollHeight;
    }
  }, [explanation, currentSection]);

  useEffect(() => {
    if (currentSection === "code" && codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [code, currentSection]);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setExplanation("");
    setCode("");
    setCurrentSection(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/chat/prompt-stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data?.fastApiToken}`,
          },
          body: JSON.stringify({ prompt, chatId: "test-frontend" }),
        }
      );

      if (!res.body) {
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        console.log(chunk);
        // Process complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") {
                setLoading(false);
                setCurrentSection(null);
                continue;
              }

              const payload = JSON.parse(jsonStr);

              // Update state immediately for real-time effect
              if (payload.type === "explanation" && payload.text) {
                setCurrentSection("explanation");
                setExplanation((prev) => prev + payload.text);
              } else if (payload.type === "code" && payload.text) {
                setCurrentSection("code");
                setCode((prev) => prev + payload.text);
              } else if (payload.type === "done") {
                console.log(
                  "Stream completed. Request ID:",
                  payload.request_id
                );
                setLoading(false);
                setCurrentSection(null);
              }
            } catch (err) {
              console.error("Invalid JSON chunk:", line, err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setLoading(false);
      setCurrentSection(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  const TypingIndicator = ({ show }: { show: boolean }) => {
    if (!show) return null;

    return (
      <span className="inline-flex items-center ml-1">
        <span className="w-1 h-4 bg-current animate-pulse"></span>
      </span>
    );
  };

  return <></>;
}
