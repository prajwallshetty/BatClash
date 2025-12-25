import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "600"], // Only 2 font weights as specified
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Batclash - Solo Coding Platform",
  description: "A LeetCode-like solo coding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


