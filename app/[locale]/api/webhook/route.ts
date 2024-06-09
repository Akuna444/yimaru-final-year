import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const res = JSON.parse(body);
  const { courseId, userId } = JSON.parse(res.meta);
  if (res.event === "charge.success") {
    await db.purchase.create({
      data: {
        courseId,
        userId,
      },
    });
  } else {
    return new NextResponse(`Webhook Error: Unhandled event type }`, {
      status: 200,
    });
  }

  return new NextResponse(null, { status: 200 });
}
