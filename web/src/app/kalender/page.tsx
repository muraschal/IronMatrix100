"use client";

import { useEffect, useMemo, useState } from "react";

type EventInstance = {
  id: string;
  title: string;
  category: string;
  description?: string;
  start: string; // ISO
  end: string; // ISO
  color?: string;
};

type ApiResponse = {
  timezone: string;
  range: { start: string; end: string };
  events: EventInstance[];
};

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = (day + 6) % 7; // Montag=0
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function iso(d: Date): string {
  return d.toISOString();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const COLOR_MAP: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-200 border-indigo-500/30",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/30",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-200 border-sky-500/30",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-200 border-fuchsia-500/30",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-200 border-rose-500/30",
  cyan: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-200 border-cyan-500/30",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-200 border-teal-500/30",
  red: "bg-red-500/15 text-red-700 dark:text-red-200 border-red-500/30",
  orange: "bg-orange-500/15 text-orange-700 dark:text-orange-200 border-orange-500/30",
};

type TimeBlock = { id: string; label: string; startMin: number; endMin: number; headerClass: string };

const TIME_BLOCKS: TimeBlock[] = [
  { id: "morning", label: "Morgens (07:00–10:00)", startMin: 7 * 60, endMin: 10 * 60, headerClass: "bg-violet-500/10 text-violet-700 dark:text-violet-200 border-violet-500/30" },
  { id: "noon", label: "Mittag (11:30–14:00)", startMin: 11 * 60 + 30, endMin: 14 * 60, headerClass: "bg-sky-500/10 text-sky-700 dark:text-sky-200 border-sky-500/30" },
  { id: "afternoon", label: "Nachmittag (15:00–18:00)", startMin: 15 * 60, endMin: 18 * 60, headerClass: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-200 border-neutral-500/30" },
  { id: "evening", label: "Abend (19:00–21:00)", startMin: 19 * 60, endMin: 21 * 60, headerClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border-emerald-500/30" },
  { id: "late", label: "Spät (21:00–22:00)", startMin: 21 * 60, endMin: 22 * 60, headerClass: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-200 border-neutral-500/30" },
];

function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export default function KalenderPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const weekStart = useMemo(() => startOfWeek(today), [today]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  useEffect(() => {
    const start = iso(weekStart);
    const end = iso(weekEnd);
    fetch(`/api/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
      .then((r) => r.json())
      .then((json: ApiResponse) => setData(json))
      .catch(() => setData(null));
  }, [weekStart, weekEnd]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventInstance[]>();
    for (const d of days) map.set(d.toDateString(), []);
    for (const ev of data?.events ?? []) {
      const d = new Date(ev.start);
      d.setHours(0, 0, 0, 0);
      const key = d.toDateString();
      if (map.has(key)) map.get(key)!.push(ev);
    }
    for (const [k, arr] of map) {
      arr.sort((a, b) => a.start.localeCompare(b.start));
      map.set(k, arr);
    }
    return map;
  }, [data, days]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kalender – aktuelle Woche</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Vergangene Tage ausgegraut, heute nur unerledigte Tasks</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-neutral-300 dark:border-neutral-700 px-2 py-1">Homeoffice: Di, Fr</span>
          <span className="rounded-full border border-neutral-300 dark:border-neutral-700 px-2 py-1">Arbeitswoche: Mo–Fr</span>
          <span className="rounded-full border border-neutral-300 dark:border-neutral-700 px-2 py-1">Weekend: Sa, So</span>
        </div>
      </header>

      {/* Desktop: Stundenplan mit vertikaler Zeitachse */}
      <div className="hidden sm:grid grid-cols-[12rem_repeat(7,minmax(0,1fr))] gap-x-3">
        {TIME_BLOCKS.map((block) => (
          <>
            {/* Zeitachsen-Zelle links */}
            <div key={`axis-${block.id}`} className={`border-t p-3 sticky left-0 self-start ${block.headerClass}`}>
              <div className="text-xs font-semibold">{block.label}</div>
            </div>
            {days.map((date) => {
              const key = date.toDateString();
              const now = new Date();
              const isPastDay = date < today;
              const isToday = isSameDay(date, today);
              const isHovered = hoverKey === key;
              const isActive = isHovered || (!hoverKey && isToday);

              const allItems = eventsByDay.get(key) ?? [];
              const list = allItems.filter((ev) => {
                const start = new Date(ev.start);
                const m = minutesOfDay(start);
                return m >= block.startMin && m < block.endMin && (!isToday || new Date(ev.end) >= now);
              });

              return (
                <div
                  key={`${key}-${block.id}`}
                  onMouseEnter={() => setHoverKey(key)}
                  onMouseLeave={() => setHoverKey((prev) => (prev === key ? null : prev))}
                  className={`border-t p-2 ${isPastDay ? "opacity-50" : ""} ${isActive ? "ring-1 ring-[rgb(var(--ring))]" : ""}`}
                  style={{ minHeight: "7rem" }}
                >
                  {list.length === 0 ? (
                    <div className="text-[11px] text-neutral-500"> </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {list.map((ev) => {
                        const startTime = new Date(ev.start).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
                        // Farbcodierung nach Tageszeit (Block)
                        const blockClass = block.headerClass
                          .replace("bg-", "bg-")
                          .replace(" text-", " ")
                          .replace(" border-", " ");
                        return (
                          <div
                            key={ev.id}
                            className={`text-xs rounded-lg px-2 py-1 border backdrop-blur bg-white/5 dark:bg-white/5 border-white/10 shadow-sm ${blockClass}`}
                          >
                            <div className="font-medium">{ev.title}</div>
                            <div className="opacity-80">{startTime}{ev.description ? ` · ${ev.description}` : ""}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* Mobile: Tagesliste mit Block-Gruppen */}
      <div className="sm:hidden grid grid-cols-1 gap-3 items-start">
        {days.map((date) => {
          const key = date.toDateString();
          const day = date.toLocaleDateString("de-DE", { weekday: "short" });
          const label = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
          const allItems = eventsByDay.get(key) ?? [];

          const now = new Date();
          const isPastDay = date < today;
          const isToday = isSameDay(date, today);

          const items = allItems.filter((ev) => {
            if (!isToday) return true; // Nur am heutigen Tag ggf. Status berücksichtigen (aber nicht ausblenden)
            const end = new Date(ev.end);
            return end >= now; // abgelaufene Termine ausblenden
          });

          return (
            <div key={key} className={`rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 ${isPastDay ? "opacity-50" : ""}`}>
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">{day}</div>
                <div className="text-xs text-neutral-500">{label}</div>
              </div>
              <div className="mt-3 space-y-3">
                {TIME_BLOCKS.map((b) => {
                  const list = items.filter((ev) => {
                    const m = minutesOfDay(new Date(ev.start));
                    return m >= b.startMin && m < b.endMin;
                  });
                  return (
                    <div key={`${key}-${b.id}`} className="space-y-2">
                      <div className={`sm:hidden rounded-md border p-2 text-xs ${b.headerClass}`}>
                        <div className="font-semibold">{b.label}</div>
                      </div>
                      {list.length === 0 ? (
                        <div className="text-xs text-neutral-500">–</div>
                      ) : (
                        list.map((ev) => {
                          const color = COLOR_MAP[ev.color ?? "indigo"] ?? COLOR_MAP.indigo;
                          const startTime = new Date(ev.start).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
                          return (
                            <div key={ev.id} className={`text-xs border rounded-md px-2 py-1 ${color}`}>
                              <div className="font-medium">{ev.title}</div>
                              <div className="opacity-80">{startTime}{ev.description ? ` · ${ev.description}` : ""}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


