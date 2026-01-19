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
    default: "Price Tracker AI - Track Prices on Amazon, Flipkart, Myntra & More",
    template: "%s | Price Tracker AI"
  },
  description: "Stop overpaying online. Price Tracker AI helps you track prices from Amazon, Flipkart, Myntra, and 100+ stores. Get real-time alerts via WhatsApp, Telegram, and Email the moment prices drop.",
  keywords: [
    "price tracker", "amazon price tracker", "flipkart price tracker", "myntra price tracker",
    "price drop alerts", "price history", "buy at lowest price", "shopping assistant",
    "deal alerts", "save money online", "price drop notification"
  ],
  authors: [{ name: "Price Tracker AI" }],
  creator: "Price Tracker AI",
  publisher: "Price Tracker AI",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pricetracker.store",
    title: "Price Tracker AI - Never Miss a Price Drop Again",
    description: "The ultimate price tracking tool for Amazon and Flipkart. Get instant alerts when prices hit your target. Start saving today!",
    siteName: "Price Tracker AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Price Tracker AI - Save money with real-time price alerts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Price Tracker AI | Free Price Drop Alerts",
    description: "Track prices on your favorite stores and save up to 70%. Instant WhatsApp & Telegram notifications!",
    images: ["/og-image.png"],
    creator: "@PriceTrackerAI",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code", // User can update this later
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
