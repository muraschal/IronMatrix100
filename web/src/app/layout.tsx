import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IronMatrix100",
  description: "100 Tage – Wochenstruktur, Trainingsplan, Essensplan",
  themeColor: "#0a0a0a",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app min-h-dvh flex flex-col`}>
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-screen-lg px-4 md:px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
