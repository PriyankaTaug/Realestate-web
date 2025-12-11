import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeralaHomez — Find A House That Suits You",
  description: "Premium real estate marketplace for Kerala. Discover, compare, and book properties.",
  icons: {
    icon: "/images/kh.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}>
        <ThemeProvider>
          <ToastProvider>
            <AppChrome>
              {children}
            </AppChrome>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
