import { ArrowUp } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
interface InputProps {
  setPrompt: (prompt: string) => void;
  onSubmit?: () => void;
  prompt: string;
  className?: string;
  disabled: boolean;
}
export default function InputBox({
  prompt,
  setPrompt,
  onSubmit = () => {},
  className,
  disabled,
}: InputProps) {
  console.log(prompt);
  return (
    <div
      className={`${
        className
          ? className
          : "bg-[#171717] flex w-full h-28 border border-white/20 rounded-xl gap-2 p-4"
      }`}
    >
      <textarea
        disabled={disabled}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        value={prompt}
        rows={1}
        placeholder="Enter a prompt to visualize your idea"
        className="pr-12 flex-1 resize-none bg-transparent text-white placeholder-white/50 outline-none border-none text-base
        custom-scrollbar"
      />
      {!className && (
        <button
          onClick={onSubmit}
          className="cursor-pointer flex justify-center items-center bg-[#3b3b3b] rounded-full h-10 w-10 hover:bg-[#4b4b4b] transition"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
