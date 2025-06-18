"use client";

import { ReactEventHandler, useState } from "react";
import { useChatStore } from "@/store/store";
import { useSession } from "next-auth/react";

export default function Input() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [code, setCode] = useState("");
  const chatId = useChatStore((state) => state.chatId);
  const { data } = useSession();

  const handleSubmit = async () => {
    setLoading(true);
    setExplanation("");
    setCode("");

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
                continue;
              }

              const payload = JSON.parse(jsonStr);

              // Update state immediately for real-time effect
              if (payload.type === "explanation" && payload.text) {
                setExplanation((prev) => prev + payload.text);
              } else if (payload.type === "code" && payload.text) {
                setCode((prev) => prev + payload.text);
              } else if (payload.type === "done") {
                console.log(
                  "Stream completed. Request ID:",
                  payload.request_id
                );
                setLoading(false);
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your prompt..."
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      {(explanation || loading) && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Explanation:</h2>
          <div className="whitespace-pre-wrap text-blue-800 min-h-[20px] relative">
            {explanation}
            {loading && !explanation && (
              <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1"></span>
            )}
          </div>
        </div>
      )}

      {(code || (loading && explanation)) && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Code:</h2>
          <pre className="whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded min-h-[40px] relative">
            {code}
            {loading && explanation && !code && (
              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
