import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MESH_URL = "https://api.meshapi.ai/v1/chat/completions";
const MODEL = "amazon/nova-micro-v1";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callMeshMessages(
  messages: ChatMessage[],
  opts: { maxTokens?: number } = {},
): Promise<string> {
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
      max_tokens: opts.maxTokens ?? 4000,
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

async function callMesh(
  system: string,
  user: string,
  opts: { maxTokens?: number } = {},
): Promise<string> {
  return callMeshMessages(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    opts,
  );
}

const BASE_STYLE = `You are Areeb Shahid Academy's tutor for Indian CBSE / NCERT students (classes 9-12).
Write like a polished, exam-ready textbook chapter — never like source code or a rushed summary.

=== FORMATTING ===
- Clean markdown with "#", "##", "###" headings, bullet lists, numbered steps, and **bold** for key terms.
- No raw code fences ("\`\`\`"), no decorative "$$$" or "####".
- Never emit LaTeX commands as plain text (never write "\\int", "\\frac", "\\sqrt" outside math delimiters).

=== ADAPT SECTIONS TO THE SUBJECT — DO NOT USE A FIXED TEMPLATE ===
Choose sections that actually fit the topic. Examples:
- Mathematics / Physics: intuition, definitions, formulas, derivations, worked examples, practice.
- Chemistry: concepts, reactions/mechanisms, equations, worked problems.
- Accountancy / Business Studies / Economics: concepts, formats, journal entries in TABLES, worked ledgers/balance sheets in TABLES, ratio formulas where relevant, NCERT questions.
- History / Political Science / Geography / Sociology / Psychology / English: themes, causes/effects, key figures/dates, analysis, exam-style answers. DO NOT invent "Formulas" or "Derivations" sections here.
- Hindi / Urdu literature: सारांश / خلاصہ, characters, key lines, question–answer style.
NEVER force "Formulas" / "Derivations" into a chapter that has none.

=== TABLES (VERY IMPORTANT FOR ACCOUNTS / COMMERCE) ===
For journal entries, ledger accounts, trial balance, balance sheet, income statement, cash-flow statement, or any tabular data — ALWAYS use markdown tables:
| Particulars | L.F. | Debit (₹) | Credit (₹) |
| --- | ---: | ---: | ---: |
Right-align numeric columns. Show totals in a final bold row. Never present accounting entries as plain sentences.

=== MATH (STRICT) ===
- Inline math: single dollars, e.g. $E = mc^2$, $\\frac{a}{b}$, $\\int_0^1 x\\,dx$.
- Block math: DOUBLE dollars on its own line:
  $$I_{\\text{rms}} = \\sqrt{\\frac{1}{T}\\int_0^T I_0^2 \\sin^2(\\omega t)\\, dt}$$
- NEVER use [ ... ], ( ... ), \\[ ... \\], or \\( ... \\) as math delimiters. Only $ and $$.
- Every backslash-command MUST be inside $...$ or $$...$$.

=== HINDI & URDU ===
Write Hindi in Devanagari (देवनागरी) and Urdu in Nastaliq/Arabic script (اُردُو) — real Unicode characters, never transliteration or escape codes.

=== DIAGRAMS & IMAGES ===
When a diagram genuinely helps (ray diagrams, circuits, cell structures, geometry figures, molecular structures, maps, financial-statement layouts, flowcharts), embed a real Wikimedia Commons image:
  ![short caption](https://upload.wikimedia.org/wikipedia/commons/...)
Use only well-known, stable Wikimedia Commons URLs you are confident exist. If unsure, DESCRIBE the diagram in words — never invent broken URLs. Place 1–3 images where they truly add value.`;

function lengthDirective(length: "short" | "medium" | "detailed"): string {
  switch (length) {
    case "short":
      return `LENGTH: QUICK SUMMARY
- ~200–300 words. Crisp definition, the single most important formula/idea, and one key insight.
- Still useful — never a one-liner.`;
    case "medium":
      return `LENGTH: BALANCED EXPLANATION
- ~500–800 words. Intuition + definitions + main formulas (only if the topic has them) + ONE fully worked example + 2 short practice Q&A.`;
    case "detailed":
      return `LENGTH: DETAILED EXPLANATION (exam-ready, textbook depth)
- Target 1500–2500+ words. This must be genuinely long and thorough — a student should be able to answer any exam question from it.
- Cover: intuition → precise definitions → all relevant formulas/rules/dates/frameworks (as appropriate to the subject) → complete step-by-step derivations OR full worked accounting formats OR full literary analysis → 3+ worked examples/case studies of increasing difficulty → common mistakes → 4–6 practice questions with FULL solutions → quick revision points at the end.
- For Accounts / Commerce: include full journal-entry tables, ledger tables, and complete formatted balance-sheet / income-statement / cash-flow tables where relevant.
- NEVER stop early. NEVER return a short answer when this length is requested.`;
  }
}

function systemFor(length: "short" | "medium" | "detailed"): string {
  return `${BASE_STYLE}\n\n${lengthDirective(length)}`;
}

const LengthSchema = z.enum(["short", "medium", "detailed"]);

function maxTokensFor(length: "short" | "medium" | "detailed"): number {
  if (length === "short") return 1200;
  if (length === "medium") return 3000;
  return 6000;
}

/* -------- Option 1: explain from uploaded document -------- */
export const explainFromDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        content: z.string().min(20).max(80000),
        question: z.string().max(1000).optional(),
        length: LengthSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const user = `The student uploaded this academic material. Read it carefully and explain the topic so they truly understand it.
${data.question ? `Their specific question: ${data.question}\n` : ""}
----- MATERIAL -----
${data.content}
----- END -----

Produce a clear, structured explanation sized to the requested LENGTH. Use sections that match the SUBJECT of the material — do not force Formulas/Derivations if the material has none.`;
    return {
      text: await callMesh(systemFor(data.length), user, {
        maxTokens: maxTokensFor(data.length),
      }),
    };
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

Produce the best personalized, exam-ready explanation possible — sized to the requested LENGTH. Use sections appropriate for ${data.subject}; do not force Formulas or Derivations if this subject has none. Use markdown tables for accounting entries / financial statements when relevant.`;
    return {
      text: await callMesh(systemFor(data.length), user, {
        maxTokens: maxTokensFor(data.length),
      }),
    };
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
    const user = `Produce a NCERT-aligned complete study guide for a Class ${data.classKey}${data.stream ? ` (${data.stream})` : ""} student.
Subject: ${data.subject}
Chapter: ${data.chapter}

Pick sections that ACTUALLY fit this subject/chapter — do not force irrelevant sections. Suggested section palette (use only what fits):
- Overview / Introduction
- Key Concepts (with definitions)
- Formulas / Rules (only for Maths, Physics, Chemistry, Accounting-ratios, Economics-stats)
- Derivations (only for Maths / Physics / Chemistry topics that require them)
- Accounting Formats & Journal Entries (in tables) — for Accountancy
- Financial Statement / Balance Sheet / Cash-Flow layouts (in tables) — for Accountancy
- Diagrams (embed real Wikimedia Commons images where they truly help)
- Worked Examples (full solutions; tables where numeric)
- NCERT Exercise Questions & Solutions
- Quick Revision Notes
- Common Mistakes / Exam Tips

Match depth to LENGTH. For DETAILED length, produce a genuinely long (1500–2500+ words), exam-ready guide.`;
    return {
      text: await callMesh(systemFor(data.length), user, {
        maxTokens: maxTokensFor(data.length),
      }),
    };
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

Briefly identify the most likely class level and subject/chapter (one italic line). Then give the best explanation for that level — sized to LENGTH, using sections appropriate to the identified subject.`;
    return {
      text: await callMesh(systemFor(data.length), user, {
        maxTokens: maxTokensFor(data.length),
      }),
    };
  });

/* -------- Follow-up: continue a previous answer (uses same length as parent) -------- */
export const followUp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        previousAnswer: z.string().min(1).max(80000),
        question: z.string().min(2).max(2000),
        length: LengthSchema.optional().default("medium"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    // Mesh AI (Bedrock Converse) requires the FIRST message to be from the user.
    // Keep the previous assistant answer as context inside a user turn, then the
    // follow-up as the second user turn is not allowed either — so we merge
    // context + follow-up into a single user message.
    const userTurn = `Here is the explanation you gave me earlier:

----- PREVIOUS EXPLANATION -----
${data.previousAnswer}
----- END -----

Follow-up question about that explanation: ${data.question}

Answer ONLY the follow-up — do not repeat the whole previous explanation. Refer back to specific steps, symbols or signs as needed and clarify the reasoning behind them.`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemFor(data.length) },
      { role: "user", content: userTurn },
    ];
    return {
      text: await callMeshMessages(messages, {
        maxTokens: maxTokensFor(data.length),
      }),
    };
  });
