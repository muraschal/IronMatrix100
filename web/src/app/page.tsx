import Image from "next/image";

export default function Home() {
  const cards = [
    { href: "/wochenstruktur", title: "Wochenstruktur", desc: "Tages- und Wochenrhythmus, Supps, Lifestyle" },
    { href: "/trainingsplan", title: "Trainingsplan", desc: "PPL, Progression, Core & Cardio" },
    { href: "/essensplan", title: "Essensplan", desc: "Warrior Diet, Makros, Dinners & WE" },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {cards.map((c) => (
        <a key={c.href} href={c.href} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
          <h2 className="text-lg font-semibold">{c.title}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{c.desc}</p>
        </a>
      ))}
    </section>
  );
}
