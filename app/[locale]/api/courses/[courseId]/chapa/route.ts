import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const uuidv4 = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    };
    const tx_ref = uuidv4();

    const user = await currentUser();

    console.log(user, "usssa");

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const header = {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };
    const body = {
      amount: course.price,
      currency: "ETB",
      email: user.emailAddresses?.[0]?.emailAddress,
      first_name: user.firstName,
      last_name: user.lastName,
      courseId: course.id,
      phone_number: "0900123456",
      tx_ref,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      meta: {
        courseId: course.id,
        userId: user.id,
      },
      "customization[title]": course.title,
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      body,
      header
    );

    return NextResponse.json({ url: response.data.data.checkout_url });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
