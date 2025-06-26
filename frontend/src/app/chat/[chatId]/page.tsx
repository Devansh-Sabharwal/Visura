"use client";
import { useChatStore } from "@/store/chatStore";
import { usePromptStore } from "@/store/promptStore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatInterface from "@/components/ChatInterface";

export default function Chat() {
  const messages = useChatStore((state) => state.messages);
  const chatId = useChatStore((state) => state.chatId);
  const setMessages = useChatStore((state) => state.setMessages);
  const prompt = usePromptStore((state) => state.prompt);
  const params = useParams();
  const cid = params.chatId as string;
  useEffect(() => {
    // setChatId(cid);
  }, []);
  useEffect(() => {
    //fetch messages
    // & send prompt if exists
  }, []);
  return (
    <div>
      <ChatInterface />
    </div>
  );
}
