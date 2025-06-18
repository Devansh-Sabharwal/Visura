"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { Send, Loader2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Manim AI Assistant
          </h1>
          <p className="text-slate-600">
            Create beautiful mathematical animations with AI
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 border-2 border-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 placeholder-slate-400"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the animation you want to create..."
              disabled={loading}
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>

        {/* Response Sections */}
        {(explanation || loading) && (
          <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                💡 Explanation
                {loading && currentSection === "explanation" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </h2>
            </div>
            <div ref={explanationRef} className="p-6 max-h-96 overflow-y-auto">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {explanation}
                <TypingIndicator
                  show={loading && currentSection === "explanation"}
                />
              </div>
              {loading && !explanation && currentSection === "explanation" && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(code || (loading && explanation)) && (
          <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                🐍 Generated Code
                {loading && currentSection === "code" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </h2>
            </div>
            <div className="relative">
              <pre
                ref={codeRef}
                className="bg-slate-900 text-green-400 p-6 max-h-96 overflow-auto font-mono text-sm leading-relaxed"
              >
                {code}
                <TypingIndicator show={loading && currentSection === "code"} />
              </pre>
              {loading && explanation && !code && currentSection === "code" && (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-green-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating code...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status indicator */}
        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">
                {currentSection === "explanation"
                  ? "Writing explanation..."
                  : currentSection === "code"
                  ? "Generating code..."
                  : "Processing..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
