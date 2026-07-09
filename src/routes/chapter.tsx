import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AiOutput } from "@/components/AiOutput";
import { CurriculumPicker, type PickerValue } from "@/components/CurriculumPicker";
import { explainChapter } from "@/lib/mesh.functions";

export const Route = createFileRoute("/chapter")({
  head: () => ({
    meta: [
      { title: "Full chapter explanation — Areeb Shahid Academy" },
      {
        name: "description",
        content:
          "Get the complete NCERT chapter: concepts, derivations, diagrams, and NCERT questions with solutions.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    classKey: typeof s.classKey === "string" ? s.classKey : "",
    subject: typeof s.subject === "string" ? s.subject : "",
    chapter: typeof s.chapter === "string" ? s.chapter : "",
    auto: s.auto === "1" ? "1" : "",
  }),
  component: ChapterPage,
});

function ChapterPage() {
  const search = Route.useSearch();
  const run = useServerFn(explainChapter);
  const [picker, setPicker] = useState<PickerValue>({
    classKey: search.classKey,
    subject: search.subject,
    chapter: search.chapter,
  });
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ready = picker.classKey && picker.subject && picker.chapter;

  async function submit() {
    setError(null);
    setText("");
    if (!ready) {
      setError("Please select class, subject and chapter first.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: picker });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-run when arriving from home tile with all three params + auto=1
  useEffect(() => {
    if (search.auto === "1" && ready && !text && !loading) {
      void submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--persian-blue)]">
            Full chapter explanation
          </h1>
          <p className="text-muted-foreground">
            Complete NCERT-style guide: concepts, derivations, diagrams, and NCERT exercise questions
            with solutions.
          </p>
        </div>

        <div className="space-y-5 rounded-lg border bg-card p-5">
          <CurriculumPicker value={picker} onChange={setPicker} />
          <Button
            onClick={submit}
            disabled={loading || !ready}
            className="bg-[color:var(--persian-blue)] hover:bg-[color:var(--persian-blue)]/90"
          >
            {loading ? "Building your chapter guide…" : "Explain full chapter"}
          </Button>
        </div>

        <AiOutput
          loading={loading}
          error={error}
          text={text}
          emptyHint="Your complete chapter guide will appear here."
        />
      </main>
    </div>
  );
}
