import { z } from "zod";
import { requireRecruiter } from "@/lib/api-auth";
import { fail, ok } from "@/lib/api-response";
import { createJob, listJobs } from "@/services/job.service";

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).default([]),
  minExperienceYears: z.number().int().min(0).default(0)
});

export async function GET() {
  try {
    const user = await requireRecruiter();
    return ok(await listJobs(user.userId));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRecruiter();
    const body = createSchema.parse(await req.json());
    return ok(await createJob({ ...body, userId: user.userId }), 201);
  } catch (error) {
    return fail(error);
  }
}
