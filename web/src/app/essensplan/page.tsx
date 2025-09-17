import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export default function EssensplanPage() {
  const file = path.join(process.cwd(), "content/nutrition.json");
  const raw = fs.readFileSync(file, "utf8");
  const data = JSON.parse(raw) as {
    plan?: { window?: string; goals?: string[]; trainingDays?: string[]; notes?: string };
    warriorDiet: {
      fasting: { start: string; end: string; notes?: string };
      feeding: { window: string; mainMeal: string; notes?: string };
    };
    supplements: {
      morning: Array<{ name: string; dose?: string; notes?: string; calories?: number }>;
      daily?: Array<{ name: string; dose?: string; notes?: string }>;
      dinner: Array<{ name: string; dose?: string; notes?: string }>;
    };
    stackSummary?: { morning?: string[]; daily?: string[]; dinner?: string[] };
    tonics?: { noon?: { title: string; time: string; items: string[] } };
    meals?: { dinnerIdeas?: string[] };
  };
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Essensplan</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Warrior Diet, Supplements & Dinner‑Ideen</p>
      </header>
      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-semibold">Warrior Diet</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Fastenfenster</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {data.warriorDiet.fasting.start} – {data.warriorDiet.fasting.end}
            </div>
            {data.warriorDiet.fasting.notes && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{data.warriorDiet.fasting.notes}</p>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">Essensfenster</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {data.warriorDiet.feeding.window} ({data.warriorDiet.feeding.mainMeal})
            </div>
            {data.warriorDiet.feeding.notes && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{data.warriorDiet.feeding.notes}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-semibold">Supplements</h2>
        <div className="mt-3 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Morgens (kalorienfrei)</div>
            <ul className="mt-2 text-sm list-disc ml-5 space-y-1">
              {data.supplements.morning.map((s, idx) => (
                <li key={`m-${idx}`}>
                  <span className="font-medium">{s.name}</span>
                  {s.dose ? ` – ${s.dose}` : ""}
                  {s.notes ? ` · ${s.notes}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">Täglich</div>
            <ul className="mt-2 text-sm list-disc ml-5 space-y-1">
              {(data.supplements.daily ?? []).map((s: any, idx: number) => (
                <li key={`t-${idx}`}>
                  <span className="font-medium">{s.name}</span>
                  {s.dose ? ` – ${s.dose}` : ""}
                  {s.notes ? ` · ${s.notes}` : ""}
                  {Array.isArray(s.details) && s.details.length > 0 && (
                    <ul className="mt-1 ml-4 list-disc space-y-1">
                      {s.details.map((d: string, i: number) => (
                        <li key={`td-${idx}-${i}`}>{d}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">Dinner (Essensfenster)</div>
            <ul className="mt-2 text-sm list-disc ml-5 space-y-1">
              {data.supplements.dinner.map((s, idx) => (
                <li key={`d-${idx}`}>
                  <span className="font-medium">{s.name}</span>
                  {s.dose ? ` – ${s.dose}` : ""}
                  {s.notes ? ` · ${s.notes}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {data.stackSummary && (
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <h2 className="text-lg font-semibold">Finaler Stack (Kurzform)</h2>
          <div className="mt-2 grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <div className="font-medium">Morgens</div>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {(data.stackSummary.morning ?? []).map((t, i) => (<li key={`sm-${i}`}>{t}</li>))}
              </ul>
            </div>
            <div>
              <div className="font-medium">Täglich</div>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {(data.stackSummary.daily ?? []).map((t, i) => (<li key={`sd-${i}`}>{t}</li>))}
              </ul>
            </div>
            <div>
              <div className="font-medium">Dinner</div>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {(data.stackSummary.dinner ?? []).map((t, i) => (<li key={`sn-${i}`}>{t}</li>))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {data.tonics?.noon && (
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <h2 className="text-lg font-semibold">{data.tonics.noon.title}</h2>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Täglich um {data.tonics.noon.time}</div>
          <ul className="mt-2 text-sm list-disc ml-5 space-y-1">
            {data.tonics.noon.items.map((t, i) => (<li key={`noon-${i}`}>{t}</li>))}
          </ul>
        </section>
      )}

      {data.meals?.dinnerIdeas && data.meals.dinnerIdeas.length > 0 && (
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <h2 className="text-lg font-semibold">Dinner‑Ideen</h2>
          <ul className="mt-2 text-sm list-disc ml-5 space-y-1">
            {data.meals.dinnerIdeas.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
