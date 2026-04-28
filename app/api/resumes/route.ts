import { fail, ok } from "@/lib/api-response";
import { saveResumeAndParse } from "@/services/resume.service";
import { prisma } from "@/lib/prisma";
import { getSystemUserId } from "@/lib/system-user";

export async function GET() {
  try {
    const userId = await getSystemUserId();
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return ok(resumes);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSystemUserId();
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return ok({ message: "file is required" }, 400);

    const bytes = Buffer.from(await file.arrayBuffer());
    const resume = await saveResumeAndParse({
      userId,
      filename: file.name,
      mimeType: file.type,
      bytes
    });

    return ok(resume, 201);
  } catch (error) {
    return fail(error);
  }
}
