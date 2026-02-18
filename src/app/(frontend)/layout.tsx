import type { Metadata } from "next";

import { GoogleTagManager } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

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
  metadataBase: new URL(`${process.env.SITE_URL}`),
  title: {
    default: `${process.env.SITE_TITLE}`,
    template: `%s | ${process.env.SITE_TITLE}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
        {process.env.NEXT_PUBLIC_ENV === "production" && <GoogleTagManager gtmId="GTM-" />}
        <Footer />
      </body>
    </html>
  );
}
