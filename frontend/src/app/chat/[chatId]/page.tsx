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
import { useAnimationStore } from "@/store/animationStore";
import { useActiveTabStore } from "@/store/activeTabStore";
import { useIsMobile } from "@/store/isMobileStore";

export default function Chat() {
  const router = useRouter();
  const params = useParams();
  const cid = params.chatId as string;
  const { data, status } = useSession();
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
  const setRequestId = useAnimationStore((state) => state.setRequestId);
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);
  const setIsMobile = useIsMobile((state) => state.setIsMobile);
  const setMobileActiveTab = useActiveTabStore(
    (state) => state.setMobileActiveTab
  );
  useEffect(() => {
    setMessages((prev) => []);
    setChatId(cid);
    setCode("");
    setActiveTab("Code");
    setMobileActiveTab("Chat");
    setRequestId("");
  }, [cid]);

  useEffect(() => {
    if (status == "loading") return;
    if (!prompt.trim()) {
      refetch();
      return;
    }
    const fetchData = async () => {
      try {
        await fetchPromptStream({
          prompt,
          chatId: cid,
          token: data?.fastApiToken!,
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
            router.push("/auth/signin");
          }, 1500);
        }
      }
    };
    fetchData();
  }, [status]);

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div>
      <ChatInterface />
    </div>
  );
}
