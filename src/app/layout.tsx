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
  title: "Typhoon Detective Game | LLM-Powered Interactive Experience",
  description: "Experience the power of Typhoon AI in this interactive detective game. Solve mysteries with dynamic AI-generated cases, intelligent clue analysis, and realistic suspect interviews. A showcase of Typhoon's AI capabilities.",
  keywords: "Typhoon AI, detective game, LLM, language model, AI game, interactive fiction, Typhoon demo, AI demo, AI-powered, text generation",
  authors: [{ name: "Typhoon AI" }],
  creator: "Typhoon AI",
  publisher: "Typhoon AI",
  applicationName: "Typhoon Detective Game",
  generator: "Next.js",
  metadataBase: new URL("https://detective-game.opentyphoon.ai"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      th: "/?lang=th",
    },
  },
  openGraph: {
    title: "Typhoon Detective Game | LLM-Powered Interactive Experience",
    description: "Experience the power of Typhoon AI in this interactive detective game. Solve mysteries with AI-generated cases, intelligent clue analysis, and realistic suspect interviews.",
    url: "https://detective-game.opentyphoon.ai",
    siteName: "Typhoon Detective Game",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Typhoon Detective Game - Powered by Typhoon AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typhoon Detective Game | AI-Powered Detective Experience",
    description: "Solve mysteries with AI-generated cases, intelligent clue analysis, and realistic suspect interviews. A showcase of Typhoon's AI capabilities.",
    images: ["/twitter-image.jpg"],
    creator: "@TyphoonAI",
    site: "@TyphoonAI",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: "/manifest.json",
  category: "game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script id="force-dark-mode" strategy="beforeInteractive">
          {`document.documentElement.classList.add('dark');`}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Typhoon Detective Game",
              "applicationCategory": "Game",
              "description": "An interactive detective game powered by Typhoon AI that showcases the capabilities of large language models in creating dynamic gaming experiences.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Typhoon AI",
                "url": "https://opentyphoon.ai"
              },
              "operatingSystem": "Web browser",
              "url": "https://detective-game.opentyphoon.ai",
              "softwareVersion": "1.0.0",
              "screenshot": "/og-image.jpg",
              "featureList": [
                "AI-generated detective cases",
                "Dynamic suspect interviews",
                "Intelligent clue analysis",
                "Multiple language support"
              ]
            }
          `}
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
