import { NextResponse } from "next/server";
import { AppError } from "@/lib/utils/errors";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
