import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signJwt } from "@/lib/auth";
import { AppError } from "@/lib/utils/errors";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new AppError("Invalid credentials", 401);

    const isValid = await verifyPassword(body.password, user.passwordHash);
    if (!isValid) throw new AppError("Invalid credentials", 401);

    const token = signJwt({ userId: user.id, role: user.role });
    const response = ok({ userId: user.id });
    response.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return response;
  } catch (error) {
    return fail(error);
  }
}
