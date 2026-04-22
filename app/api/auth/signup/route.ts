import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwt } from "@/lib/auth";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, role: "RECRUITER" }
    });

    const token = signJwt({ userId: user.id, role: user.role });
    const response = ok({ userId: user.id }, 201);
    response.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return response;
  } catch (error) {
    return fail(error);
  }
}
