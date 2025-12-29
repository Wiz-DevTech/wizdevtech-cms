import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "5CMS - WizDevTech Content Management System",
  description: "Advanced content management system with AI-powered features, role-based access control, and modern UI.",
  keywords: ["5CMS", "WizDevTech", "CMS", "Content Management", "AI", "Next.js", "TypeScript"],
  authors: [{ name: "WizDevTech Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "5CMS - Advanced Content Management",
    description: "AI-powered content management system with modern React stack",
    url: "https://chat.z.ai",
    siteName: "5CMS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "5CMS - Advanced Content Management",
    description: "AI-powered content management system with modern React stack",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
