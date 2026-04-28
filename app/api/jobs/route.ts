import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { createJob, listJobs } from "@/services/job.service";
import { getSystemUserId } from "@/lib/system-user";

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).default([]),
  minExperienceYears: z.number().int().min(0).default(0)
});

export async function GET() {
  try {
    const userId = await getSystemUserId();
    return ok(await listJobs(userId));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSystemUserId();
    const body = createSchema.parse(await req.json());
    return ok(await createJob({ ...body, userId }), 201);
  } catch (error) {
    return fail(error);
  }
}
