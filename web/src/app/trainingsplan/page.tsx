import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-static";

export default function TrainingsplanPage() {
  const file = path.join(process.cwd(), "content/trainingsplan.md");
  const md = fs.readFileSync(file, "utf8");
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
    </article>
  );
}
