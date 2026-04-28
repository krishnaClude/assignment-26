import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { generateMatchScore } from "@/services/ai.service";
import { getSystemUserId } from "@/lib/system-user";

const schema = z.object({ jobId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const userId = await getSystemUserId();
    const { jobId } = schema.parse(await req.json());

    const [job, resumes] = await Promise.all([
      prisma.job.findFirst({ where: { id: jobId, userId } }),
      prisma.resume.findMany({ where: { userId } })
    ]);

    if (!job) return ok({ message: "Job not found" }, 404);

    const requiredSkills = (job.requiredSkills as string[]) ?? [];
    const upserts = resumes.map(async (resume) => {
      const parsed = resume.parsedData as {
        name: string; email: string; skills: string[]; experience: string[]; education: string[];
      };
      const result = await generateMatchScore(parsed, {
        title: job.title,
        description: job.description,
        requiredSkills
      });

      return prisma.candidateMatch.upsert({
        where: { resumeId_jobId: { resumeId: resume.id, jobId: job.id } },
        update: {
          score: result.score,
          insights: { reasoning: result.reasoning },
          missingSkills: result.missingSkills,
          strengths: result.strengths
        },
        create: {
          resumeId: resume.id,
          jobId: job.id,
          score: result.score,
          insights: { reasoning: result.reasoning },
          missingSkills: result.missingSkills,
          strengths: result.strengths
        }
      });
    });

    await Promise.all(upserts);

    const ranking = await prisma.candidateMatch.findMany({
      where: { jobId: job.id },
      include: { resume: true },
      orderBy: { score: "desc" }
    });

    return ok(ranking);
  } catch (error) {
    return fail(error);
  }
}
