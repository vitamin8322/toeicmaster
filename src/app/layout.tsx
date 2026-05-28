import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./global.css";
import React from "react";

const sans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "TOEICMaster Vietnam - Đột Phá Điểm Số",
  description: "Nền tảng luyện thi TOEIC thông minh dành riêng cho người Việt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased bg-background text-slate-800">
        {children}
      </body>
    </html>
  );
}
