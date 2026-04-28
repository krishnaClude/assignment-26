import { prisma } from "@/lib/prisma";

const SYSTEM_RECRUITER_EMAIL = "default-recruiter@local.dev";

export async function getSystemUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: SYSTEM_RECRUITER_EMAIL },
    create: {
      email: SYSTEM_RECRUITER_EMAIL,
      passwordHash: "NO_AUTH_MODE",
      role: "RECRUITER"
    },
    update: {}
  });

  return user.id;
}
