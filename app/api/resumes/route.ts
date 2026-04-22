import { requireRecruiter } from "@/lib/api-auth";
import { fail, ok } from "@/lib/api-response";
import { saveResumeAndParse } from "@/services/resume.service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireRecruiter();
    const resumes = await prisma.resume.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" }
    });
    return ok(resumes);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRecruiter();
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return ok({ message: "file is required" }, 400);

    const bytes = Buffer.from(await file.arrayBuffer());
    const resume = await saveResumeAndParse({
      userId: user.userId,
      filename: file.name,
      mimeType: file.type,
      bytes
    });

    return ok(resume, 201);
  } catch (error) {
    return fail(error);
  }
}
