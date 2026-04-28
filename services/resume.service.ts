import fs from "node:fs/promises";
import path from "node:path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/utils/env";
import { AppError } from "@/lib/utils/errors";
import { parseResume } from "@/services/ai.service";

export async function saveResumeAndParse(params: {
  userId: string;
  filename: string;
  mimeType: string;
  bytes: Buffer;
}) {
  const uploadDir = path.join(process.cwd(), env.UPLOAD_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, `${Date.now()}-${params.filename}`);
  await fs.writeFile(filePath, params.bytes);

  const rawText = await extractText(filePath, params.mimeType);
  const parsed = await parseResume(rawText);

  return prisma.resume.create({
    data: {
      fileUrl: filePath,
      rawText,
      parsedData: parsed,
      userId: params.userId
    }
  });
}

async function extractText(filePath: string, mimeType: string): Promise<string> {
  const file = await fs.readFile(filePath);
  if (mimeType.includes("pdf")) {
    const result = await pdf(file);
    return result.text;
  }
  if (mimeType.includes("word") || filePath.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: file });
    return result.value;
  }
  throw new AppError("Unsupported file type", 400);
}
