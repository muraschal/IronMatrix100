"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-background/70 backdrop-blur">
      <nav className="mx-auto max-w-screen-lg px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">IronMatrix100</Link>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/wochenstruktur" className="hover:text-primary">Wochenstruktur</Link>
          <Link href="/trainingsplan" className="hover:text-primary">Trainingsplan</Link>
          <Link href="/essensplan" className="hover:text-primary">Essensplan</Link>
          <Link href="/kalender" className="hover:text-primary">Kalender</Link>
          <ThemeToggle />
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Menü öffnen"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-screen-lg px-4 py-3 flex flex-col gap-3 text-sm">
            <Link href="/wochenstruktur" onClick={() => setOpen(false)}>Wochenstruktur</Link>
            <Link href="/trainingsplan" onClick={() => setOpen(false)}>Trainingsplan</Link>
            <Link href="/essensplan" onClick={() => setOpen(false)}>Essensplan</Link>
            <Link href="/kalender" onClick={() => setOpen(false)}>Kalender</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;


