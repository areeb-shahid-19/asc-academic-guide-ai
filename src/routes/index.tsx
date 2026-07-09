import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutput } from "@/components/AiOutput";
import { explainAuto } from "@/lib/mesh.functions";
import { CLASS_KEYS, CURRICULUM } from "@/lib/curriculum";
import { Menu, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Areeb Shahid Academy — AI tutor for Classes 9-12" },
      {
        name: "description",
        content:
          "AI-powered learning for CBSE / NCERT students of classes 9-12. Ask any topic, upload notes, or get full chapter explanations.",
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

  async function askAuto(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setText("");
    if (prompt.trim().length < 3) return;
    setLoading(true);
    try {
      const res = await run({ data: { prompt } });
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
          <h1 className="leading-tight">
            <span className="font-welcome text-5xl md:text-7xl text-[color:var(--persian-blue)]">
              Welcome
            </span>
            <span className="mx-2 text-2xl md:text-3xl text-foreground/80">to</span>
            <br />
            <span className="font-academy text-3xl md:text-5xl font-bold uppercase tracking-wider text-[color:var(--persian-blue)]">
              Areeb Shahid Academy
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-powered tutor for CBSE / NCERT students, Classes 9 to 12. Ask anything, upload
            your notes, or dive into a full chapter.
          </p>
        </section>

        {/* Search bar */}
        <section className="mx-auto max-w-2xl">
          <form onSubmit={askAuto} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Search any topic — e.g. Newton's second law, quadratic equations…"
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 bg-[color:var(--persian-blue)] hover:bg-[color:var(--persian-blue)]/90"
            >
              {loading ? "Thinking…" : "Ask AI"}
            </Button>
          </form>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Menu className="h-3.5 w-3.5" /> Tap the menu (top-left) for uploads, topic Q&amp;A and
            full-chapter mode.
          </p>
        </section>

        {/* AI result (only when there is content / activity) */}
        {(loading || text || error) && (
          <section className="mx-auto max-w-3xl">
            <AiOutput loading={loading} error={error} text={text} />
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
  return (
    <Link
      to="/chapter"
      search={{ classKey, subject: "", chapter: "", auto: "" }}
      className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
    >
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Class</div>
        <div className="mt-1 text-5xl font-bold text-[color:var(--persian-blue)]">{classKey}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          {cls.subjects.length} subjects · NCERT
        </div>
      </div>
      <div className="mt-6 text-sm font-medium text-[color:var(--persian-blue)] opacity-80 group-hover:opacity-100">
        Choose subject &amp; chapter →
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-1 rounded-b-2xl bg-[color:var(--persian-blue)] opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}
