import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>        
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
          <nav className="mx-auto max-w-screen-md px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">IronMatrix100</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/wochenstruktur">Wochenstruktur</Link>
              <Link href="/trainingsplan">Trainingsplan</Link>
              <Link href="/essensplan">Essensplan</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-screen-md px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
