import { prisma } from "@/lib/prisma";

export async function createJob(data: {
  title: string;
  description: string;
  requiredSkills: string[];
  minExperienceYears: number;
  userId: string;
}) {
  return prisma.job.create({ data });
}

export async function listJobs(userId: string) {
  return prisma.job.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}
