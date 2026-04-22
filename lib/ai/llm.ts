import Groq from "groq-sdk";
import { env } from "@/lib/utils/env";

export const llmClient = env.GROQ_API_KEY
  ? new Groq({ apiKey: env.GROQ_API_KEY })
  : null;

export async function getTextEmbedding(input: string): Promise<number[]> {
  return tokenizeFallbackEmbedding(input);
}

export async function completeJson<T>(prompt: string): Promise<T> {
  if (!llmClient) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const completion = await llmClient.chat.completions.create({
    model: env.GROQ_MODEL,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty completion from LLM");
  }

  return JSON.parse(content) as T;
}

function tokenizeFallbackEmbedding(text: string): number[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const vector = new Array(128).fill(0);
  for (const token of normalized.split(/\s+/)) {
    if (!token) continue;
    const idx = token.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 128;
    vector[idx] += 1;
  }
  const magnitude = Math.sqrt(vector.reduce((acc, v) => acc + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}
