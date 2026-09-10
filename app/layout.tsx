import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RefreshData from "./RefreshData";
import { auth } from "@/auth";
import DarkMode from "./DarkMode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Blog",
  description: "A personal blog for essays, observations, and beautiful detours.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = (await auth())?.user;
  const isDarkMode = user?.darkmode === "true";
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${isDarkMode ? `dark-mode-html` : ''}`}>
      <body>{children}</body>
      <RefreshData />
      <DarkMode/>
    </html>
  );
}
