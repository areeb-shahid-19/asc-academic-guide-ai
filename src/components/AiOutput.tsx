import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

export function AiOutput({
  loading,
  error,
  text,
  emptyHint,
}: {
  loading: boolean;
  error: string | null;
  text: string;
  emptyHint?: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-[color:var(--persian-blue)]" />
        <span>Thinking… searching NCERT-level sources and preparing your explanation.</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }
  if (!text) {
    return emptyHint ? (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        {emptyHint}
      </div>
    ) : null;
  }
  return (
    <article className="prose prose-slate max-w-none rounded-lg border bg-card p-6 dark:prose-invert prose-headings:text-[color:var(--persian-blue)] prose-strong:text-[color:var(--persian-blue)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </article>
  );
}
