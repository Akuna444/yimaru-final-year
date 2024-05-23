import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const createdAttachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    try {
      const response = await fetch(
        `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${url
          .split("/")
          .pop()}`
      );

      const blob = await response.blob();

      const loader = new PDFLoader(blob);

      const pageLevelDocs = await loader.load();

      await db.attachment.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdAttachment.id,
        },
      });

      // vectorize and index entire document
      const pinecone = new Pinecone();
      const pineconeIndex = pinecone.Index("yimaru");

      await PineconeStore.fromDocuments(
        pageLevelDocs,
        new CohereEmbeddings({
          apiKey: process.env.COHERE_API_KEY,
          batchSize: 48,
        }),
        {
          pineconeIndex,
          maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
        }
      );

      await db.attachment.update({
        data: {
          uploadStatus: "SUCCESS",
        },
        where: {
          id: createdAttachment.id,
        },
      });
    } catch (err) {
      await db.attachment.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdAttachment.id,
        },
      });
    }

    return NextResponse.json(createdAttachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
