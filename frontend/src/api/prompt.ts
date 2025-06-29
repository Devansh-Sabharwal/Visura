import { Message } from "@/types/message";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export async function fetchPromptStream({
  prompt,
  chatId,
  token,
  setMessages,
  setPrompt,
  setCode,
  setLoading,
  setRequestId,
  setActiveTab,
}: {
  prompt: string;
  chatId: string;
  token: string;
  messages: Message[];
  setMessages: (update: Message[] | ((prev: Message[]) => Message[])) => void;
  setPrompt: (value: string) => void;
  setCode: (value: string) => void;
  setLoading: (val: boolean) => void;
  setRequestId: (val: string) => void;
  setActiveTab: (val: string) => void;
}) {
  if (!prompt.trim()) return;
  setMessages((prevMessages) => [
    ...prevMessages,
    { role: "user", content: prompt, timestamp: Date.now().toString() },
  ]);
  setLoading(true);
  setMessages((prevMessages) => [
    ...prevMessages,
    {
      role: "model",
      content: "",
      timestamp: Date.now().toString(),
    },
  ]);

  let explanation = "";
  let code = "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FASTAPI_URL}/chat/prompt-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, chatId }),
      }
    );
    if (!res.ok) {
      if (res.status == 400) throw new Error("Chat not found");
      if (res.status == 500) throw new Error("Internet Error");
      if (res.status == 401) throw new Error("Unauthorized");
    }
    if (!res.body) {
      setLoading(false);
      return;
    }
    setPrompt("");
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          continue;
        }

        try {
          const payload = JSON.parse(jsonStr);

          if (payload.type === "explanation" && payload.text) {
            explanation += payload.text;
            setLoading(false);
          } else if (payload.type === "code" && payload.text) {
            setActiveTab("Code");
            code += payload.text;
          } else if (payload.type === "done") {
            setRequestId(payload.request_id);
            setActiveTab("Animation");
          } else if (payload.type == "error") {
            toast.error("Server Error Please Try Again");
          }

          setMessages((prevMessages) => {
            const updated = [...prevMessages];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex]?.role === "model") {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: JSON.stringify({ explanation, code }),
              };
            }
            return updated;
          });

          if (code.trim()) setCode(code);
        } catch (err) {
          console.error("Invalid JSON chunk:", line, err);
        }
      }
    }
  } catch (error: any) {
    setLoading(false);

    if (error.message == "Unauthorized") {
      throw new Error("Unauthorized");
    } else if (error.message == "Internet Error") {
      toast.error("Server Error Please Try Again");
    } else {
      toast.error(`Streaming error: ${error?.message || "Unknown error"}`);
    }
  }
}
