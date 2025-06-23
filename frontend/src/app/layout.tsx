import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"], // Specify needed weights
});

import "./globals.css";
import { Providers } from "../lib/session-provider";
import ReactQueryProvider from "@/lib/react-query";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visura",
  description: "AI 2D animation generator",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/logo.svg", // Path to your favicon
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/logo.svg", // Use the same or a different image for Apple devices
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ReactQueryProvider>
          <Providers>
            {children}
            <Toaster position="top-right" />
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
