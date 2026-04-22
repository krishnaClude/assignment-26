import { cookies } from "next/headers";
import { AppError } from "@/lib/utils/errors";
import { verifyJwt } from "@/lib/auth";

export async function requireRecruiter() {
  const token = cookies().get("auth_token")?.value;
  if (!token) throw new AppError("Unauthorized", 401);

  const payload = verifyJwt(token);
  if (payload.role !== "RECRUITER") throw new AppError("Forbidden", 403);
  return payload;
}
