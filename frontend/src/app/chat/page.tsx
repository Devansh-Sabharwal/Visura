"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chatStore";
import Input from "@/components/Input";
import toast from "react-hot-toast";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  const params = useParams();
  const initialChatId = params?.chatId as string | undefined;
  const chatId = useChatStore((state) => state.chatId);
  type Message = { role: "user" | "assistant"; content: string };
  const [messages, setMessages] = useState<Message[]>([]);

  // const handleSend = async (prompt: string) => {
  //   let cid = chatId;

  //   if (!cid) {
  //     cid = uuidv4();
  //     setChatId(cid);
  //     router.replace(`/chat/${cid}`);
  //   }
  // };

  return (
    <>
      <Input />
      {/* <ChatInterface /> */}
      {/* <button onClick={() => toast.error("Test error")}>Test Toast</button> */}
    </>
  );
}
