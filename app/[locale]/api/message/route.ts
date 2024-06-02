import { db } from "@/lib/db";
import { groq } from "@/lib/groq";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { auth } from "@clerk/nextjs/server";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextRequest } from "next/server";
import translate from "google-translate-api-next";
import { getLocale } from "next-intl/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json();
  const locale = await getLocale();

  const { userId } = auth();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  let { attachmentId, message } = SendMessageValidator.parse(body);

  const file = await db.attachment.findFirst({
    where: {
      id: attachmentId,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      attachmentId,
    },
  });

  if (locale !== "en") {
    const res = await translate(message, { to: "en" });
    message = res.text;
  }

  // 1: vectorize message

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index("yimaru");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new CohereEmbeddings({ apiKey: process.env.COHERE_API_KEY, batchSize: 48 }),
    { pineconeIndex }
  );

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: {
      attachmentId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      if (locale !== "en") {
        const res = await translate(completion, { to: locale });
        completion = res.text;
      }
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          attachmentId,
          userId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
