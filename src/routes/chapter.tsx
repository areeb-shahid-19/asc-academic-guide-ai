import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { AiOutput } from "@/components/AiOutput";
import { CurriculumPicker, type PickerValue } from "@/components/CurriculumPicker";
import { LengthButton, type LengthChoice } from "@/components/LengthButton";
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
    stream: typeof s.stream === "string" ? s.stream : "",
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
    stream: search.stream,
    subject: search.subject,
    chapter: search.chapter,
  });
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ready = picker.classKey && picker.subject && picker.chapter;

  async function submit(length: LengthChoice) {
    setError(null);
    setText("");
    if (!ready) {
      setError("Please select class, subject and chapter first.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { ...picker, length } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (search.auto === "1" && ready && !text && !loading) {
      void submit("detailed");
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
          <LengthButton
            label="Explain full chapter"
            loading={loading}
            disabled={!ready}
            onChoose={submit}
          />
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
