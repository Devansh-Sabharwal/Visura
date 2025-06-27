"use client";
import { useChatStore } from "@/store/chatStore";
import { usePromptStore } from "@/store/promptStore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import { useMessages } from "@/hooks/useMessages";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useCodeStore } from "@/store/codeStore";
import { fetchPromptStream } from "@/api/prompt";

export default function Chat() {
  const router = useRouter();
  const params = useParams();
  const cid = params.chatId as string;
  const { data } = useSession();
  const {
    data: content,
    isPending,
    error,
    isError,
    refetch,
  } = useMessages(cid, data?.fastApiToken ?? "");
  const setChatId = useChatStore((state) => state.setChatId);
  const setMessages = useChatStore((state) => state.setMessages);
  const messages = useChatStore((state) => state.messages);
  const setLoading = useChatStore((state) => state.setLoading);
  const setCode = useCodeStore((state) => state.setCode);
  const prompt = usePromptStore((state) => state.prompt);
  const setPrompt = usePromptStore((state) => state.setPrompt);
  useEffect(() => {
    setChatId(cid);
    setCode("");
  }, [cid]);

  useEffect(() => {
    if (!prompt.trim()) {
      refetch();
      return;
    }
    const fetchData = async () => {
      await fetchPromptStream({
        prompt,
        chatId: cid,
        token: data?.fastApiToken!,
        messages,
        setMessages,
        setPrompt,
        setCode,
        setLoading,
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isError) {
      if (error instanceof Error && error.message === "Unauthorized") {
        toast.error("Session expired. Please sign in again.");
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else if (error.message == "Chat not found") {
        toast.error(error?.message || "Failed to load messages.");
        setTimeout(() => {
          router.push("/chat");
        }, 3000);
      } else {
        toast.error(error?.message || "Failed to load messages.");
      }
    }
  }, [error, isError]);

  useEffect(() => {
    if (content?.messages) {
      const formattedMessages = content.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        videoUrl: msg.video_url,
      }));
      setMessages(formattedMessages);
    }
  }, [content]);
  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);
  return (
    <div>
      <ChatInterface />
    </div>
  );
}
