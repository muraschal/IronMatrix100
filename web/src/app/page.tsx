"use client";
import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => void 0);
    }
  }, []);

  const cards = [
    { href: "/wochenstruktur", title: "Wochenstruktur", desc: "Tages- und Wochenrhythmus, Supps, Lifestyle" },
    { href: "/trainingsplan", title: "Trainingsplan", desc: "PPL, Progression, Core & Cardio" },
    { href: "/essensplan", title: "Essensplan", desc: "Warrior Diet, Makros, Dinners & WE" },
  ];
  return (
    <div className="space-y-10">
      <section className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          100 Tage. Ein System. <span className="text-primary">IronMatrix</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Wochenstruktur, Training und Ernährung – klar, fokussiert und mobil-optimiert.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/wochenstruktur">
            <Button size="lg">Jetzt starten</Button>
          </Link>
          <a href="/api/ironmatrix.ics" download>
            <Button variant="outline" size="lg">ICS herunterladen</Button>
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {c.title}
                  <span className="opacity-0 group-hover:opacity-100 transition text-primary">→</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{c.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
