import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { currentUser } from "@clerk/nextjs/server";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if ((user && !user.id) || !user?.emailAddresses[0].emailAddress)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    return { success: true };
  }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        attachmentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { attachmentId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.attachment.findFirst({
        where: {
          id: attachmentId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          attachmentId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ attachmentId: z.string() }))
    .query(async ({ input }) => {
      console.log("gettinguploadstatus");
      const attachment = await db.attachment.findFirst({
        where: {
          id: input.attachmentId,
        },
      });

      console.log("attachment that supposed to be fetched", attachment);

      if (!attachment) return { status: "PENDING" as const };

      return { status: attachment.uploadStatus };
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const file = await db.attachment.findFirst({
        where: {
          name: input.key,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
});

export type AppRouter = typeof appRouter;
