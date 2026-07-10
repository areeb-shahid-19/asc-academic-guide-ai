import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MESH_URL = "https://api.meshapi.ai/v1/chat/completions";
const MODEL = "amazon/nova-micro-v1";

async function callMesh(system: string, user: string): Promise<string> {
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
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
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
- Every LaTeX command (\\frac, \\sqrt, \\int, \\sum, \\lim, \\vec, \\alpha, \\pi, \\theta, \\omega, subscripts _ , superscripts ^ , \\text{...}) MUST be inside $...$ or $$...$$. Never leave a backslash-command in plain prose — that renders as raw code to the student.
- Never write math as ASCII like "integral of x dx" or "x^2/2" outside math delimiters.

DIAGRAMS & IMAGES
- Whenever a diagram, figure or illustration genuinely helps understanding (ray diagrams, circuit diagrams, cell structure, graphs, geometry figures, molecular structures, maps, historical photos), embed a real image using markdown image syntax:
  ![short descriptive caption](IMAGE_URL)
- Use only stable, freely-hostable URLs from Wikimedia Commons ( https://upload.wikimedia.org/wikipedia/commons/... ) or Wikipedia. Prefer well-known Commons files for standard NCERT topics (e.g. human heart, mitochondria, DNA double helix, projectile motion, Ohm's law circuit, periodic table, Indian map, Mughal architecture, etc.).
- Choose the best-rated, clearest image for each concept. Place 1–3 images per response where they actually add value; do not spam.
- If you are not confident a specific image URL is correct, describe the diagram in words instead — do NOT invent broken URLs.
- Never output raw HTML <img> tags; only markdown image syntax.

STRUCTURE
- Start with a short intro paragraph.
- Then use headings and numbered/bulleted steps.
- Include worked examples with fully-typeset math steps.
- Match depth to the student's class level.`;


/* -------- Option 1: explain from uploaded document -------- */
export const explainFromDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        content: z.string().min(20).max(60000),
        question: z.string().max(1000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `The student uploaded this academic material. Read it carefully and explain the topic to them so they truly understand it.
${data.question ? `Their specific question: ${data.question}\n` : ""}
----- MATERIAL -----
${data.content}
----- END -----

Now produce a clear, structured explanation covering: the core idea, key concepts, worked examples if applicable, and 3 short self-check questions with answers.`;
    return { text: await callMesh(BASE_STYLE, user) };
  });

/* -------- Option 2: filtered topic question -------- */
export const explainTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        classKey: z.string(),
        subject: z.string(),
        chapter: z.string(),
        prompt: z.string().min(3).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `Student context:
- Class: ${data.classKey} (CBSE / NCERT)
- Subject: ${data.subject}
- Chapter: ${data.chapter}

Their question / topic: ${data.prompt}

Search your knowledge of the NCERT textbook and standard supplementary sources at this class level. Produce the best personalized, exam-ready explanation possible: intuition, definitions, formulas (with derivations if relevant), a worked example, a diagram description if applicable, and 2 practice questions with solutions.`;
    return { text: await callMesh(BASE_STYLE, user) };
  });

/* -------- Option 3: full chapter explanation -------- */
export const explainChapter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        classKey: z.string(),
        subject: z.string(),
        chapter: z.string(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `Produce a complete NCERT-aligned study guide for a Class ${data.classKey} student.
Subject: ${data.subject}
Chapter: ${data.chapter}

Structure the output with clear markdown headings:
1. **Overview** — what the chapter is about, why it matters.
2. **Key Concepts** — every important idea, defined precisely.
3. **Formulas / Rules** — all formulas with meaning of each symbol.
4. **Derivations** — step-by-step derivations of every derivation-worthy result.
5. **Diagrams** — text descriptions / ASCII diagrams for each important figure.
6. **Worked Examples** — 3-4 solved problems of increasing difficulty.
7. **NCERT Exercise Questions & Solutions** — the standard end-of-chapter NCERT questions with complete solutions (as accurately as you can recall them).
8. **Quick Revision Notes** — 8-10 bullet points to revise the night before an exam.
9. **Common Mistakes** — 5 pitfalls students make in this chapter.

Be thorough, accurate to the NCERT textbook, and exam-ready.`;
    return { text: await callMesh(BASE_STYLE, user) };
  });

/* -------- Home search: auto-detect class/subject -------- */
export const explainAuto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().min(3).max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const user = `A CBSE / NCERT student (class 9-12) asked this without telling you their class or subject:

"${data.prompt}"

First, briefly identify the most likely class level and subject/chapter for this topic (one line, italicised). Then give the best exam-ready explanation for that level: intuition, definitions, formulas, worked example, diagram description if useful, and 2 practice questions with solutions.`;
    return { text: await callMesh(BASE_STYLE, user) };
  });
