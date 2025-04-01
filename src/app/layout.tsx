import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bangers } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GameProvider } from "@/contexts/GameContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  weight: ["400"],
  variable: "--font-borderlands",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typhoon Detective Game",
  description: "An interactive detective game with Borderlands-inspired UI",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script id="force-dark-mode" strategy="beforeInteractive">
          {`document.documentElement.classList.add('dark');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <GameProvider>
              {children}
            </GameProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
