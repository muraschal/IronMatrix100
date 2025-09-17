import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-static";

export default function WochenstrukturPage() {
  const file = path.join(process.cwd(), "content/wochenstruktur.md");
  const md = fs.readFileSync(file, "utf8");
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wochenstruktur</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Tages- und Wochenrhythmus, Supps, Lifestyle</p>
      </header>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
      </article>
    </div>
  );
}
