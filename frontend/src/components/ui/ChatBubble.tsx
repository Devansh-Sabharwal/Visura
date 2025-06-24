import React from "react";

interface Props {
  role: string;
  text: string;
}

export default function ChatBubble({ role, text }: Props) {
  return (
    <div
      className={`${
        role === "user" ? "bg-[#434343]" : "bg-none "
      } text-white text-sm rounded-lg px-4 py-2 max-w-[90%] w-fit leading-6`}
    >
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  );
}
