"use client";

import { useEffect, useState } from "react";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const shouldDark = saved ? saved === "dark" : getSystemPrefersDark();
    setIsDark(shouldDark);
    if (shouldDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      aria-label="Theme umschalten"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      {isDark ? (
        // Sonne
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM12 4a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm8 9a1 1 0 0 1-1-1 1 1 0 1 1 2 0 1 1 0 0 1-1 1ZM4 13a1 1 0 0 1-1-1 1 1 0 1 1 2 0 1 1 0 0 1-1 1Zm13.657 6.243a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0ZM4.222 6.343a1 1 0 0 1 0-1.415l.707-.707A1 1 0 1 1 6.343 5.636l-.707.707a1 1 0 0 1-1.414 0Zm13.435-.707a1 1 0 0 1 1.414 0l.707.707A1 1 0 1 1 18.05 8.464l-.707-.707a1 1 0 0 1 0-1.414ZM4.929 18.95a1 1 0 0 1 0-1.415l.707-.707A1 1 0 1 1 7.05 18.95l-.707.707a1 1 0 0 1-1.414 0Z"/>
        </svg>
      ) : (
        // Mond
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;


