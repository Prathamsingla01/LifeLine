import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { AIChatbot } from "@/components/ai/AIChatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "LifeLine — Emergency Response Platform",
  description: "AI-powered emergency response platform with accident detection, disaster mapping, family safety, and transparent fundraising.",
  keywords: ["emergency response", "accident detection", "family safety", "disaster mapping", "AI", "SOS"],
  openGraph: {
    title: "LifeLine — Emergency Response Platform",
    description: "When every second saves a life. AI-powered emergency intelligence.",
    type: "website",
    siteName: "LifeLine",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeLine — Emergency Response Platform",
    description: "When every second saves a life. AI-powered emergency intelligence.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "LifeLine",
              description: "AI-powered emergency response platform",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="pt-16 pb-20 lg:pb-0">
          {children}
        </main>
        <AIChatbot />
      </body>
    </html>
  );
}
