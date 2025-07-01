import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="h-[56px] border-b border-white/10">
      <div className="h-full flex p-4 items-center justify-between">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="hover:cursor-pointer"
        >
          <img src="/logo2.svg" alt="Logo" className="h-[24px] sm:h-[30px]" />
        </div>
        <button
          onClick={() => {
            const handleLogout = async () => {
              await signOut({
                callbackUrl: "/signin", // Optional: redirect after logout
              });
            };

            handleLogout();
          }}
          className="text-xs sm:text-base mr-2 hover:scale-110 transition-all duration-500 px-3 py-2 rounded-lg cursor-pointer border border-white/60"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
