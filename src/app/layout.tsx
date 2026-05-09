import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FloatingActions } from "@/components/floating-actions";
import { RootLayoutClient } from "@/components/root-layout-client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainVault",
  description: "Trustless microfinance for the underbanked on Solana",
  icons: [
    {
      rel: "icon",
      url: "/favicon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootLayoutClient>{children}</RootLayoutClient>
        <FloatingActions />
      </body>
    </html>
  );
}
