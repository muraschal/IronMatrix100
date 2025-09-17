import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { supabase } from "@/lib/supabase";

type Recurrence = {
  freq: "DAILY" | "WEEKLY";
  byDay?: Array<"MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU">;
  startDate: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
};

type SourceEvent = {
  id: string;
  title: string;
  category: string;
  description?: string;
  short?: string;
  details?: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  recurrence: Recurrence;
  color?: string;
};

type CalendarData = {
  version: number;
  timezone: string;
  events: SourceEvent[];
};

function parseDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

function toLocal(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function formatISO(date: Date): string {
  return date.toISOString();
}

const DAY_MAP: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

function* eachDay(from: Date, to: Date): Generator<Date> {
  const current = new Date(from);
  while (current <= to) {
    yield new Date(current);
    current.setDate(current.getDate() + 1);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  const defaultStart = new Date();
  defaultStart.setHours(0, 0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultStart.getDate() + 28);

  const rangeStart = startParam ? new Date(startParam) : defaultStart;
  const rangeEnd = endParam ? new Date(endParam) : defaultEnd;

  let data: CalendarData | null = null;
  let events: SourceEvent[] = [];

  // Try Supabase first: expecting a materialized view or RPC that returns expanded instances
  if (supabase) {
    const { data: rows, error } = await supabase
      .from("calendar_instances")
      .select("id,title,category,description,start,end,color")
      .gte("start", rangeStart.toISOString())
      .lte("end", rangeEnd.toISOString())
      .order("start", { ascending: true });

    if (!error && rows && rows.length > 0) {
      return NextResponse.json({
        source: "supabase",
        timezone: "Europe/Berlin",
        range: { start: rangeStart.toISOString(), end: rangeEnd.toISOString() },
        events: rows,
      });
    }
  }

  // Fallback to local JSON recurrence expansion
  const file = path.join(process.cwd(), "content/calendar.json");
  const raw = fs.readFileSync(file, "utf8");
  data = JSON.parse(raw);
  events = (data?.events ?? []) as SourceEvent[];
  const instances: Array<{
    id: string;
    title: string;
    category: string;
    description?: string;
    start: string;
    end: string;
    color?: string;
  }> = [];

  for (const ev of events) {
    const rec = ev.recurrence;
    const evStart = toLocal(parseDate(rec.startDate));
    const evUntil = toLocal(parseDate(rec.until));

    const overlapStart = rangeStart > evStart ? rangeStart : evStart;
    const overlapEnd = rangeEnd < evUntil ? rangeEnd : evUntil;
    if (overlapEnd < overlapStart) continue;

    for (const day of eachDay(overlapStart, overlapEnd)) {
      const weekday = day.getDay();
      if (rec.freq === "WEEKLY") {
        if (!rec.byDay || !rec.byDay.some((d) => DAY_MAP[d] === weekday)) continue;
      }
      // DAILY: jedes Datum passt

      const [sh, sm] = ev.startTime.split(":").map(Number);
      const [eh, em] = ev.endTime.split(":").map(Number);
      const start = new Date(day);
      start.setHours(sh ?? 0, sm ?? 0, 0, 0);
      const end = new Date(day);
      end.setHours(eh ?? 0, em ?? 0, 0, 0);

      instances.push({
        id: `${ev.id}-${day.toISOString().slice(0, 10)}`,
        title: ev.title,
        category: ev.category,
        description: ev.description,
        start: formatISO(start),
        end: formatISO(end),
        color: ev.color,
      });
    }
  }

  // Sort by start time
  instances.sort((a, b) => a.start.localeCompare(b.start));

  return NextResponse.json({
    source: "json",
    timezone: data?.timezone ?? "Europe/Berlin",
    range: { start: formatISO(rangeStart), end: formatISO(rangeEnd) },
    events: instances,
  });
}


