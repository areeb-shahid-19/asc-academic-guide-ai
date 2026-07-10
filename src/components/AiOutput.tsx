import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Loader2 } from "lucide-react";

/**
 * The model sometimes emits math with the "wrong" delimiters:
 *   \[ ... \]      (LaTeX display)
 *   \( ... \)      (LaTeX inline)
 *   [ \frac{a}{b} ]   (bracket-wrapped LaTeX, no backslash)
 *   ( \int x\,dx )    (paren-wrapped LaTeX inline)
 * remark-math only understands $...$ and $$...$$, so we normalize
 * everything to dollar delimiters before rendering.
 */
function normalizeMath(input: string): string {
  let s = input;
  // \[ ... \]  ->  $$ ... $$
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, body) => `$$${body}$$`);
  // \( ... \)  ->  $ ... $
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, body) => `$${body}$`);
  // [ ... ]  with a LaTeX command inside  ->  $$ ... $$
  s = s.replace(/(^|[\s>])\[\s*([^\[\]\n]*\\[a-zA-Z]+[^\[\]]*?)\s*\]/g,
    (_m, pre, body) => `${pre}$$${body}$$`);
  // ( ... )  with a LaTeX command inside  ->  $ ... $
  s = s.replace(/(^|[\s>])\(\s*([^()\n]*\\[a-zA-Z]+[^()]*?)\s*\)/g,
    (_m, pre, body) => `${pre}$${body}$`);
  return s;
}


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
    <article className="prose prose-slate max-w-none rounded-lg border bg-card p-6 dark:prose-invert prose-headings:text-[color:var(--persian-blue)] prose-strong:text-[color:var(--persian-blue)] prose-img:mx-auto prose-img:rounded-lg prose-img:border prose-img:shadow-sm prose-img:my-6 prose-img:max-h-96 prose-img:object-contain">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({ node: _node, alt, src, ...props }) => (
            <figure className="my-6 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...props}
                src={src}
                alt={alt ?? ""}
                loading="lazy"
                className="max-h-96 w-auto rounded-lg border object-contain shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const cap = (e.currentTarget as HTMLImageElement)
                    .nextElementSibling as HTMLElement | null;
                  if (cap) cap.style.display = "none";
                }}
              />
              {alt ? (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                  {alt}
                </figcaption>
              ) : null}
            </figure>
          ),
        }}
      >
        {normalizeMath(text)}
      </ReactMarkdown>
    </article>
  );
}
