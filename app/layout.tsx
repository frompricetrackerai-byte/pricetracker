import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pricetracker.store'),
  title: {
    default: "Price Tracker AI - Track Prices on Amazon, Flipkart & More",
    template: "%s | Price Tracker AI"
  },
  description: "Never miss a price drop again. Track products from Amazon, Flipkart, Myntra, and Ajio. Get instant alerts via WhatsApp, Telegram, and Email when prices drop.",
  keywords: ["price tracker", "amazon price tracker", "flipkart price history", "price drop alert", "deal finder", "save money online", "price history graph"],
  authors: [{ name: "Price Tracker AI" }],
  creator: "Price Tracker AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pricetracker.store",
    title: "Price Tracker AI - Never Miss a Price Drop",
    description: "Track prices from 100+ stores including Amazon & Flipkart. Get instant WhatsApp/Telegram alerts.",
    siteName: "Price Tracker AI",
    images: [
      {
        url: "/og-image.png", // We should create/ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: "Price Tracker AI Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Price Tracker AI - Track Prices & Save Money",
    description: "Instant price drop alerts for Amazon, Flipkart, and more. Stop overpaying online.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
