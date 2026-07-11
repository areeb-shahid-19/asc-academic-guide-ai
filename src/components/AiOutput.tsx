import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageCirclePlus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LengthButton, type LengthChoice } from "@/components/LengthButton";
import { followUp } from "@/lib/mesh.functions";

/**
 * Normalize common wrong math delimiters to KaTeX-friendly $ / $$.
 */
function normalizeMath(input: string): string {
  let s = input;
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, body) => `$$${body}$$`);
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, body) => `$${body}$`);
  s = s.replace(
    /(^|[\s>])\[\s*([^\[\]\n]*\\[a-zA-Z]+[^\[\]]*?)\s*\]/g,
    (_m, pre, body) => `${pre}$$${body}$$`,
  );
  s = s.replace(
    /(^|[\s>])\(\s*([^()\n]*\\[a-zA-Z]+[^()]*?)\s*\)/g,
    (_m, pre, body) => `${pre}$${body}$`,
  );
  return s;
}

function Markdown({ text }: { text: string }) {
  return (
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
  );
}

function FollowUpBox({ previousAnswer }: { previousAnswer: string }) {
  const run = useServerFn(followUp);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(length: LengthChoice) {
    if (question.trim().length < 2) {
      setError("Type your follow-up question first.");
      return;
    }
    setError(null);
    setAnswer("");
    setLoading(true);
    try {
      const res = await run({ data: { previousAnswer, question, length } });
      setAnswer(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--persian-blue)]">
        <MessageCirclePlus className="h-4 w-4" />
        Ask a follow-up about this answer
      </div>
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Why is this sign negative in step 3?"
        className="h-11"
      />
      <div>
        <LengthButton
          label="Ask follow-up"
          loading={loading}
          disabled={!question.trim()}
          onChoose={ask}
        />
      </div>
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-[color:var(--persian-blue)]" />
          Working on your follow-up…
        </div>
      )}
      {answer && (
        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-[color:var(--persian-blue)] prose-strong:text-[color:var(--persian-blue)] prose-img:mx-auto prose-img:rounded-lg prose-img:border prose-img:shadow-sm prose-img:my-6 prose-img:max-h-96 prose-img:object-contain">
          <Markdown text={answer} />
        </article>
      )}
    </div>
  );
}

export function AiOutput({
  loading,
  error,
  text,
  emptyHint,
  showFollowUp = true,
}: {
  loading: boolean;
  error: string | null;
  text: string;
  emptyHint?: string;
  showFollowUp?: boolean;
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
    <div className="space-y-4">
      <article className="prose prose-slate max-w-none rounded-lg border bg-card p-6 dark:prose-invert prose-headings:text-[color:var(--persian-blue)] prose-strong:text-[color:var(--persian-blue)] prose-img:mx-auto prose-img:rounded-lg prose-img:border prose-img:shadow-sm prose-img:my-6 prose-img:max-h-96 prose-img:object-contain">
        <Markdown text={text} />
      </article>
      {showFollowUp && <FollowUpBox previousAnswer={text} />}
    </div>
  );
}
