import type { Metadata } from "next";

import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import { Ads } from "@/components/Ads";
import { NewsletterDialogProvider } from "@/providers/newsletter-dialog";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} antialiased`} id="topo">
        <NewsletterDialogProvider>
          <Header />
          <div className="container mb-6" id="conteudo">
            <Ads className="mx-auto max-w-5xl" position="main" />
          </div>
          {children}
          {process.env.NEXT_PUBLIC_ENV === "production" && <GoogleTagManager gtmId="GTM-58L35CT" />}
          <Footer />
        </NewsletterDialogProvider>
      </body>
    </html>
  );
}
