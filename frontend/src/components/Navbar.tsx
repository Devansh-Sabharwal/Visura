import { useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="h-[56px] border-b border-white/10">
      <div className="h-full flex p-4 items-center">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="hover:cursor-pointer"
        >
          <img src="/logo2.svg" alt="Logo" className="h-[30px]" />
        </div>
      </div>
    </div>
  );
}
