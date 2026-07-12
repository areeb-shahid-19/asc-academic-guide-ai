import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { AiOutput } from "@/components/AiOutput";
import { CurriculumPicker, type PickerValue } from "@/components/CurriculumPicker";
import { LengthButton, type LengthChoice } from "@/components/LengthButton";
import { explainTopic } from "@/lib/mesh.functions";

export const Route = createFileRoute("/topic")({
  head: () => ({
    meta: [
      { title: "Ask a topic — Areeb Shahid Academy" },
      {
        name: "description",
        content:
          "Pick your class, subject and chapter, then ask any question. Get a personalized NCERT-level explanation.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    classKey: typeof s.classKey === "string" ? s.classKey : "",
    stream: typeof s.stream === "string" ? s.stream : "",
    subject: typeof s.subject === "string" ? s.subject : "",
    chapter: typeof s.chapter === "string" ? s.chapter : "",
  }),
  component: TopicPage,
});

function TopicPage() {
  const search = Route.useSearch();
  const run = useServerFn(explainTopic);
  const [picker, setPicker] = useState<PickerValue>({
    classKey: search.classKey,
    stream: search.stream,
    subject: search.subject,
    chapter: search.chapter,
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastLength, setLastLength] = useState<LengthChoice>("medium");

  const ready = picker.classKey && picker.subject && picker.chapter;

  async function submit(length: LengthChoice) {
    setError(null);
    setText("");
    if (!ready) {
      setError("Please select class, subject and chapter first.");
      return;
    }
    if (prompt.trim().length < 3) {
      setError("Type what you'd like to learn about.");
      return;
    }
    setLastLength(length);
    setLoading(true);
    try {
      const res = await run({ data: { ...picker, prompt, length } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const placeholder = examplePlaceholder(picker.subject, picker.chapter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--persian-blue)]">Ask about a topic</h1>
          <p className="text-muted-foreground">
            Filter by class, subject and chapter — then ask any question. The AI will build a
            personalized, exam-ready answer at your level.
          </p>
        </div>

        <div className="space-y-5 rounded-lg border bg-card p-5">
          <CurriculumPicker value={picker} onChange={setPicker} />

          {ready && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Your question</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                className="min-h-[100px]"
              />
              <LengthButton
                label="Get explanation"
                loading={loading}
                disabled={prompt.trim().length < 3}
                onChoose={submit}
              />
            </div>
          )}
        </div>

        <AiOutput
          loading={loading}
          error={error}
          text={text}
          length={lastLength}
          emptyHint="Pick a chapter and ask a question to see your explanation here."
        />
      </main>
    </div>
  );
}
