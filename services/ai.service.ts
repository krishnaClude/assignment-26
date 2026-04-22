import { z } from "zod";
import { completeJson, getTextEmbedding } from "@/lib/ai/llm";
import { cosineSimilarity } from "@/lib/utils/similarity";
import type { MatchResult, ParsedResume } from "@/types/domain";

const parsedResumeSchema = z.object({
  name: z.string().default("Unknown"),
  email: z.string().email().or(z.literal("unknown@example.com")),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.string()).default([]),
  education: z.array(z.string()).default([])
});

export async function parseResume(text: string): Promise<ParsedResume> {
  const prompt = `Extract resume JSON only with keys name,email,skills,experience,education from:\n${text}`;
  try {
    const parsed = await completeJson<ParsedResume>(prompt);
    return parsedResumeSchema.parse(parsed);
  } catch {
    return regexResumeFallback(text);
  }
}

export async function extractSkills(text: string): Promise<string[]> {
  const parsed = await parseResume(text);
  return parsed.skills;
}

export async function generateMatchScore(resume: ParsedResume, job: { title: string; description: string; requiredSkills: string[]; }): Promise<MatchResult> {
  const [resumeEmbedding, jobEmbedding] = await Promise.all([
    getTextEmbedding(`${resume.skills.join(" ")} ${resume.experience.join(" ")}`),
    getTextEmbedding(`${job.title} ${job.description} ${job.requiredSkills.join(" ")}`)
  ]);

  const sim = cosineSimilarity(resumeEmbedding, jobEmbedding);
  const matched = job.requiredSkills.filter((skill) =>
    resume.skills.some((resumeSkill) => resumeSkill.toLowerCase() === skill.toLowerCase())
  );
  const missing = job.requiredSkills.filter((s) => !matched.includes(s));
  const skillRatio = job.requiredSkills.length ? matched.length / job.requiredSkills.length : 1;
  const score = Math.round(((sim * 0.6) + (skillRatio * 0.4)) * 100);

  return {
    score: Math.max(0, Math.min(score, 100)),
    missingSkills: missing,
    strengths: matched,
    reasoning: `${matched.length} required skills matched; semantic similarity ${(sim * 100).toFixed(1)}%`
  };
}

function regexResumeFallback(text: string): ParsedResume {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "unknown@example.com";
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const name = lines[0] ?? "Unknown";
  const skillHits = text.match(/\b(JavaScript|TypeScript|React|Next.js|Node.js|Python|SQL|AWS|Docker|Kubernetes)\b/gi) ?? [];
  return {
    name,
    email,
    skills: Array.from(new Set(skillHits.map((s) => s.trim()))),
    experience: lines.filter((l) => /(engineer|developer|manager|analyst)/i.test(l)).slice(0, 5),
    education: lines.filter((l) => /(bachelor|master|phd|university|college)/i.test(l)).slice(0, 3)
  };
}
