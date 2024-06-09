import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = req.body;
  if (body?.event === "charge.success") {
    console.log("success");
    return NextResponse.json({ msg: "Success" });
  } else {
    return new NextResponse(`Webhook Error: Unhandled event type`, {
      status: 200,
    });
  }

  return new NextResponse(null, { status: 200 });
}
