import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MESH_URL = "https://api.meshapi.ai/v1/chat/completions";
const MODEL = "amazon/nova-micro-v1";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callMeshMessages(messages: ChatMessage[]): Promise<string> {
  const key = process.env.MESH_API_KEY;
  if (!key) throw new Error("MESH_API_KEY is not configured");

  const res = await fetch(MESH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mesh AI error [${res.status}]: ${text.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callMesh(system: string, user: string): Promise<string> {
  return callMeshMessages([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);
}

const BASE_STYLE = `You are Areeb Shahid Academy's tutor for Indian CBSE / NCERT students (classes 9-12).
Write like a polished textbook, not like source code. Follow these rules strictly:

FORMATTING
- Use clean markdown: proper headings with "#", "##", "###" (not "####" for emphasis), bullet lists, numbered steps, and **bold** for key terms.
- Do NOT dump raw code fences (\`\`\`), and do NOT use "$$$", "####" as decoration. Never show LaTeX commands like "\\int" or "\\frac" as plain text.

MATH (VERY IMPORTANT — READ CAREFULLY)
- Render ALL mathematics as real LaTeX inside dollar-sign math delimiters ONLY:
  - Inline math: single dollars, e.g. $E = mc^2$, $\\frac{a}{b}$, $\\int_0^1 x\\,dx$.
  - Display / block math: DOUBLE dollars on their OWN LINE, e.g.
    $$I_{\\text{rms}} = \\sqrt{\\frac{1}{T}\\int_0^T I_0^2 \\sin^2(\\omega t)\\, dt}$$
- ABSOLUTELY DO NOT use square brackets [ ... ] or parentheses ( ... ) as math delimiters. Do NOT write "[ I_{rms} = ... ]" or "( \\frac{a}{b} )".
- Do NOT use \\[ \\] or \\( \\) either — only $ and $$.
- Every LaTeX command (\\frac, \\sqrt, \\int, \\sum, \\lim, \\vec, \\alpha, \\pi, \\theta, \\omega, subscripts _ , superscripts ^ , \\text{...}) MUST be inside $...$ or $$...$$. Never leave a backslash-command in plain prose.
- Never write math as ASCII like "integral of x dx" or "x^2/2" outside math delimiters.

DIAGRAMS & IMAGES
- Whenever a diagram, flowchart, figure or illustration genuinely helps understanding (ray diagrams, circuit diagrams, cell structure, graphs, geometry figures, molecular structures, maps, historical photos, financial-statement layouts, flowcharts), embed a real image using markdown image syntax:
  ![short descriptive caption](IMAGE_URL)
- Use only stable, freely-hostable URLs from Wikimedia Commons ( https://upload.wikimedia.org/wikipedia/commons/... ) or Wikipedia. Prefer well-known Commons files for standard NCERT topics.
- Choose the best-rated, clearest image for each concept. Place 1–3 images per response where they actually add value; do not spam.
- If you are not confident a specific image URL is correct, describe the diagram in words instead — do NOT invent broken URLs.
- Never output raw HTML <img> tags; only markdown image syntax.

STRUCTURE
- Match depth to the requested LENGTH (see below) and to the student's class level.`;

function lengthDirective(length: "short" | "medium" | "detailed"): string {
  switch (length) {
    case "short":
      return `LENGTH: SHORT (Quick summary)
- Aim for roughly 150–250 words.
- Give the crisp definition, the single most important formula (if any), and one key insight.
- Do NOT include long derivations, multiple examples, or exercise questions.
- Even short answers MUST be genuinely useful — never respond with a one-line placeholder or a filler like "here is a summary". If the topic is inherently large (e.g. a full chapter), give the essentials, not everything.
- Still embed one small helpful diagram/image if it truly clarifies the idea.`;
    case "medium":
      return `LENGTH: MEDIUM (Balanced explanation)
- Aim for roughly 400–700 words.
- Cover intuition, definitions, the main formulas with meaning of each symbol, ONE fully worked example, and 2 practice questions with brief solutions.
- Include a diagram/image if it clearly helps.`;
    case "detailed":
      return `LENGTH: DETAILED (Full textbook depth)
- Produce a thorough, exam-ready explanation.
- Include intuition, precise definitions, ALL relevant formulas, complete step-by-step derivations, 2–3 worked examples of increasing difficulty, common mistakes, and 3–4 practice questions with full solutions.
- Include diagrams/images wherever they add real value.`;
  }
}

function systemFor(length: "short" | "medium" | "detailed"): string {
  return `${BASE_STYLE}\n\n${lengthDirective(length)}`;
}

const LengthSchema = z.enum(["short", "medium", "detailed"]);

/* -------- Option 1: explain from uploaded document -------- */
export const explainFromDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        content: z.string().min(20).max(60000),
        question: z.string().max(1000).optional(),
        length: LengthSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `The student uploaded this academic material. Read it carefully and explain the topic to them so they truly understand it.
${data.question ? `Their specific question: ${data.question}\n` : ""}
----- MATERIAL -----
${data.content}
----- END -----

Now produce a clear, structured explanation covering: the core idea, key concepts, worked examples if applicable, and self-check questions with answers — sized to the requested LENGTH.`;
    return { text: await callMesh(systemFor(data.length), user) };
  });

/* -------- Option 2: filtered topic question -------- */
export const explainTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        classKey: z.string(),
        stream: z.string().optional().default(""),
        subject: z.string(),
        chapter: z.string(),
        prompt: z.string().min(3).max(2000),
        length: LengthSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `Student context:
- Class: ${data.classKey} (CBSE / NCERT)${data.stream ? `\n- Stream: ${data.stream}` : ""}
- Subject: ${data.subject}
- Chapter: ${data.chapter}

Their question / topic: ${data.prompt}

Search your knowledge of the NCERT textbook and standard supplementary sources at this class level. Produce the best personalized, exam-ready explanation possible — sized to the requested LENGTH.`;
    return { text: await callMesh(systemFor(data.length), user) };
  });

/* -------- Option 3: full chapter explanation -------- */
export const explainChapter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        classKey: z.string(),
        stream: z.string().optional().default(""),
        subject: z.string(),
        chapter: z.string(),
        length: LengthSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `Produce a NCERT-aligned study guide for a Class ${data.classKey}${data.stream ? ` (${data.stream})` : ""} student.
Subject: ${data.subject}
Chapter: ${data.chapter}

If the requested LENGTH is DETAILED, use these sections (with markdown headings):
1. **Overview**
2. **Key Concepts**
3. **Formulas / Rules**
4. **Derivations**
5. **Diagrams** (embed real images where helpful)
6. **Worked Examples**
7. **NCERT Exercise Questions & Solutions**
8. **Quick Revision Notes**
9. **Common Mistakes**

If MEDIUM, keep sections 1, 2, 3, 6, 8 only.
If SHORT, produce a concise chapter recap (Overview, top 5 key concepts, top formulas, and 5 revision-note bullets) — still genuinely useful, never a one-liner.`;
    return { text: await callMesh(systemFor(data.length), user) };
  });

/* -------- Home search: auto-detect class/subject -------- */
export const explainAuto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        prompt: z.string().min(3).max(2000),
        length: LengthSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `A CBSE / NCERT student (class 9-12) asked this without telling you their class or subject:

"${data.prompt}"

First, briefly identify the most likely class level and subject/chapter for this topic (one italic line). Then give the best explanation for that level — sized to the requested LENGTH.`;
    return { text: await callMesh(systemFor(data.length), user) };
  });

/* -------- Follow-up: continue a previous answer -------- */
export const followUp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        previousAnswer: z.string().min(1).max(80000),
        question: z.string().min(2).max(2000),
        length: LengthSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const messages: ChatMessage[] = [
      { role: "system", content: systemFor(data.length) },
      {
        role: "assistant",
        content: data.previousAnswer,
      },
      {
        role: "user",
        content: `Follow-up question about the explanation you just gave me: ${data.question}

Answer ONLY the follow-up — do not repeat the whole previous explanation. Refer back to specific steps, symbols or signs as needed and clarify the reasoning behind them.`,
      },
    ];
    return { text: await callMeshMessages(messages) };
  });
