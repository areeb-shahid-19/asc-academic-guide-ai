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

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth/mammoth.browser");
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value;
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buf, { type: "array" });
    const parts: string[] = [];
    for (const sheetName of wb.SheetNames) {
      parts.push(`# Sheet: ${sheetName}\n`);
      parts.push(XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]));
      parts.push("\n");
    }
    return parts.join("\n");
  }
  if (name.endsWith(".pptx")) {
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(buf);
    const slides = Object.keys(zip.files)
      .filter((n) => /^ppt\/slides\/slide\d+\.xml$/i.test(n))
      .sort();
    const chunks: string[] = [];
    for (const s of slides) {
      const xml = await zip.files[s].async("string");
      const text = xml
        .replace(/<a:br\s*\/>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) chunks.push(`## ${s.split("/").pop()}\n${text}`);
    }
    return chunks.join("\n\n");
  }
  // Fallback: plain text (.txt, .md, etc.)
  return await file.text();
}

function UploadPage() {
  const run = useServerFn(explainFromDocument);
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastLength, setLastLength] = useState<LengthChoice>("medium");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setError("File is too large (max 15 MB). Paste the text below instead.");
      return;
    }
    try {
      setError(null);
      setFileName(file.name);
      const txt = await extractTextFromFile(file);
      if (!txt || txt.trim().length < 5) {
        setError("Couldn't read any text from that file. Try pasting the content below.");
        return;
      }
      setContent(txt.slice(0, 80000));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not read that file: ${err.message}`
          : "Could not read that file. Please paste the text below.",
      );
    }
  }

  async function submit(length: LengthChoice) {
    setError(null);
    setText("");
    if (content.trim().length < 20) {
      setError("Please upload or paste at least a paragraph of material.");
      return;
    }
    setLastLength(length);
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
            Upload a Word, Excel, PowerPoint or text file — or paste content — and the AI will
            read it and teach it back to you.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="file">Upload a file (.docx, .xlsx, .pptx, .txt, .md, .csv)</Label>
            <label
              htmlFor="file"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-accent"
            >
              <FileUp className="h-5 w-5 text-[color:var(--persian-blue)]" />
              <span className="text-sm text-muted-foreground">
                {fileName
                  ? `Loaded: ${fileName} — click again to choose another`
                  : "Click to choose a Word / Excel / PowerPoint / text file, or paste below."}
              </span>
              <input
                id="file"
                type="file"
                accept=".txt,.md,.csv,.docx,.xlsx,.xls,.pptx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
          length={lastLength}
          emptyHint="Your personalized explanation will appear here."
        />
      </main>
    </div>
  );
}
