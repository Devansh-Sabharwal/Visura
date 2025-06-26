import React from "react";
interface Props {
  text: string;
}
export default function Suggestion({ text }: Props) {
  return (
    <div className="cursor-pointer bg-white/5 w-fit py-1.5 px-3 text-[11px] m-1.5 rounded-2xl border border-white/40">
      {text}
    </div>
  );
}
