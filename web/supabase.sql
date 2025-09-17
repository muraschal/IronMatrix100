-- Schema für IronMatrix100 Kalender (Supabase)
-- Ausführen in Supabase SQL Editor

create extension if not exists pgcrypto;

-- 1) Quelltabelle mit Wiederholungen
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  color text,
  freq text not null check (freq in ('DAILY','WEEKLY')),
  by_dow int[], -- 0=So ... 6=Sa (für WEEKLY)
  start_date date not null,
  until date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

-- 2) View mit expandierten Instanzen
create or replace view public.calendar_instances as
with expanded as (
  select
    e.id::text || '-' || to_char(d, 'YYYY-MM-DD') as id,
    e.title,
    e.category,
    e.description,
    e.color,
    make_timestamptz(extract(year from d)::int, extract(month from d)::int, extract(day from d)::int,
                     extract(hour from e.start_time)::int, extract(minute from e.start_time)::int, 0, 'Europe/Berlin') as start,
    make_timestamptz(extract(year from d)::int, extract(month from d)::int, extract(day from d)::int,
                     extract(hour from e.end_time)::int, extract(minute from e.end_time)::int, 0, 'Europe/Berlin') as end
  from public.calendar_events e
  cross join generate_series(e.start_date, e.until, interval '1 day') as d
  where
    e.freq = 'DAILY'
    or (
      e.freq = 'WEEKLY'
      and extract(dow from d)::int = any (coalesce(e.by_dow, array[]::int[]))
    )
)
select * from expanded;

-- 3) Seed: neue Trainingszeiten (Di/Fr/So)
insert into public.calendar_events (title, category, description, color, freq, by_dow, start_date, until, start_time, end_time)
values
  ('Gym – Push', 'training', 'Push-Fokus.', 'red', 'WEEKLY', array[2], '2025-09-16', '2025-12-23', '18:30', '19:45'), -- DI (2)
  ('Gym – Legs+Core', 'training', 'Beine + Core.', 'red', 'WEEKLY', array[5], '2025-09-19', '2025-12-23', '08:00', '09:15'), -- FR (5)
  ('Gym – Pull', 'training', 'Pull-Fokus.', 'red', 'WEEKLY', array[0], '2025-09-21', '2025-12-23', '09:00', '10:15'); -- SO (0)

-- Optional: Post-Workout-Instanzen als eigene Events
-- Supplement-Blöcke (täglich)
insert into public.calendar_events (title, category, description, color, freq, start_date, until, start_time, end_time)
values
  ('Supplements – Morgens (kalorienfrei)', 'supplements', 'Zink 25 mg (5×/Woche) + Magnesium 200–400 mg – Autophagie bleibt aktiv', 'violet', 'DAILY', '2025-09-15', '2025-12-23', '07:30', '07:40'),
  ('Kreatin + Apfelessig Ritual', 'supplements', 'Kreatin 5 g in Wasser; Apfelessig 1 EL in 200 ml Wasser (optional Sprudel + Prise Salz) – Autophagie safe', 'violet', 'DAILY', '2025-09-15', '2025-12-23', '12:00', '12:05'),
  ('Supplements – Dinner', 'supplements', 'Vitamin D3 + Omega‑3 (EPA+DHA)', 'violet', 'DAILY', '2025-09-15', '2025-12-23', '19:30', '19:40');

-- Kreatin Daily Reminder (Dinner)
insert into public.calendar_events (title, category, description, color, freq, start_date, until, start_time, end_time)
values
  ('Kreatin – täglich', 'supplements', '5 g zum Dinner, viel Wasser; Zeitpunkt flexibel, aber täglich', 'violet', 'DAILY', '2025-09-15', '2025-12-23', '19:30', '19:35');

-- RLS (optional, wenn Multi-User benötigt wird); aktuell global lesbar.

