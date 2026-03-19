import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniMarket | verified student marketplace",
  description: "A premium trustworthy marketplace for university students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
          USER NOTE: This is the main HTML structure for the entire application.
          The <html> and <body> tags are defined here.
      */}
      <body className={`${inter.className} bg-soft-bg min-h-screen text-deepIndigo antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
