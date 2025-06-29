"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { SessionSync } from "@/components/SessionSync";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
};
