import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { AiOutput } from "@/components/AiOutput";
import { LengthButton, type LengthChoice } from "@/components/LengthButton";
import { explainAuto } from "@/lib/mesh.functions";
import { CLASS_KEYS, CURRICULUM, classHasStreams } from "@/lib/curriculum";
import { Menu, Search } from "lucide-react";
import wordmarkUrl from "@/assets/wordmark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Areeb Shahid Academy — AI tutor for Classes 9-12" },
      {
        name: "description",
        content:
          "AI-driven learning for Classes 9–12. Ask any topic or get full chapter explanations. We provide the tools you need to achieve academic excellence.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const run = useServerFn(explainAuto);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastLength, setLastLength] = useState<LengthChoice>("medium");

  async function askAuto(length: LengthChoice) {
    setError(null);
    setText("");
    if (prompt.trim().length < 3) {
      setError("Type a topic in the search bar first.");
      return;
    }
    setLastLength(length);
    setLoading(true);
    try {
      const res = await run({ data: { prompt, length } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-10">
        {/* Welcome */}
        <section className="text-center space-y-2">
          <h1 className="leading-tight flex flex-wrap items-baseline justify-center gap-x-3 md:gap-x-4 text-black">
            <span className="font-welcome text-5xl md:text-7xl">Welcome</span>
            <span className="font-welcome text-5xl md:text-7xl">to</span>
          </h1>
          <img
            src={wordmarkUrl}
            alt="Areeb Shahid Academy"
            className="mx-auto h-16 sm:h-20 md:h-24 w-auto object-contain"
          />
          <p className="text-muted-foreground max-w-2xl mx-auto pt-2">
            AI-powered tutor for CBSE / NCERT students, Classes 9 to 12. Ask anything, upload
            your notes, or dive into a full chapter.
          </p>
        </section>

        {/* Search bar + Ask AI button inline */}
        <section className="mx-auto max-w-3xl space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Search any topic — e.g. Newton's second law, quadratic equations…"
                className="pl-10 h-12 text-base"
              />
            </div>
            <LengthButton
              label="Ask AI"
              loading={loading}
              disabled={prompt.trim().length < 3}
              onChoose={askAuto}
              className="sm:w-auto"
            />
          </div>
          <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Menu className="h-3.5 w-3.5" /> Tap the menu (top-left) for uploads, topic Q&amp;A and
            full-chapter mode. Pick an answer length from the button to run.
          </p>
        </section>

        {/* AI result (only when there is content / activity) */}
        {(loading || text || error) && (
          <section className="mx-auto max-w-3xl">
            <AiOutput loading={loading} error={error} text={text} length={lastLength} />
          </section>
        )}

        {/* Class tiles */}
        <section className="space-y-4">
          <h2 className="text-center text-xl font-semibold text-[color:var(--persian-blue)]">
            Pick your class
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CLASS_KEYS.map((k) => (
              <ClassTile key={k} classKey={k} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t bg-[color:var(--persian-blue)] py-4 text-center text-sm text-white/80">
        © {new Date().getFullYear()} Areeb Shahid Academy
      </footer>
    </div>
  );
}


function ClassTile({ classKey }: { classKey: string }) {
  const cls = CURRICULUM[classKey];
  const streamed = classHasStreams(classKey);
  const subCount = streamed
    ? cls.streams
      ? Object.values(cls.streams).flat().length
      : 0
    : cls.subjects
      ? cls.subjects.length
      : 0;
  return (
    <Link
      to="/chapter"
      search={{ classKey, stream: "", subject: "", chapter: "", auto: "" }}
      className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
    >
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Class</div>
        <div className="mt-1 text-5xl font-bold text-[color:var(--persian-blue)]">{classKey}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          {streamed ? "3 streams · " : ""}
          {subCount} subjects · NCERT
        </div>
      </div>
      <div className="mt-6 text-sm font-medium text-[color:var(--persian-blue)] opacity-80 group-hover:opacity-100">
        {streamed ? "Choose stream, subject & chapter →" : "Choose subject & chapter →"}
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-1 rounded-b-2xl bg-[color:var(--persian-blue)] opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}
