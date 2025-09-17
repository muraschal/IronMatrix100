import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-static";

export default function TrainingsplanPage() {
  const file = path.join(process.cwd(), "content/trainingsplan.md");
  const md = fs.readFileSync(file, "utf8");
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Trainingsplan</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">PPL, Progression, Core & Cardio</p>
      </header>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
      </article>
    </div>
  );
}
