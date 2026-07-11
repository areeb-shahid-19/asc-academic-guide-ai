import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutput } from "@/components/AiOutput";
import { LengthButton, type LengthChoice } from "@/components/LengthButton";
import { explainFromDocument } from "@/lib/mesh.functions";
import { FileUp } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload material — Areeb Shahid Academy" },
      {
        name: "description",
        content:
          "Upload or paste your academic notes and get an AI-powered explanation tailored to you.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const run = useServerFn(explainFromDocument);
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5 MB). Paste the text below instead.");
      return;
    }
    try {
      const txt = await file.text();
      setContent(txt);
      setError(null);
    } catch {
      setError("Could not read that file. Please paste the text below.");
    }
  }

  async function submit(length: LengthChoice) {
    setError(null);
    setText("");
    if (content.trim().length < 20) {
      setError("Please upload or paste at least a paragraph of material.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: { content, question: question || undefined, length },
      });
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
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--persian-blue)]">
            Upload your material
          </h1>
          <p className="text-muted-foreground">
            Paste a chapter, notes, or an assignment — the AI will read it and teach it back to you.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="file">Upload a text file (.txt, .md)</Label>
            <label
              htmlFor="file"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-accent"
            >
              <FileUp className="h-5 w-5 text-[color:var(--persian-blue)]" />
              <span className="text-sm text-muted-foreground">
                Click to choose a .txt / .md file, or paste the content below.
              </span>
              <input
                id="file"
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Or paste the content here</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your notes, textbook chapter, or assignment text…"
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="q">Specific question (optional)</Label>
            <Input
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Explain the derivation on page 2 in simple words"
            />
          </div>

          <LengthButton
            label="Explain to me"
            loading={loading}
            disabled={content.trim().length < 20}
            onChoose={submit}
          />
        </div>

        <AiOutput
          loading={loading}
          error={error}
          text={text}
          emptyHint="Your personalized explanation will appear here."
        />
      </main>
    </div>
  );
}
