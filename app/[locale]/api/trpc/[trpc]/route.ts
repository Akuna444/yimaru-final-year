import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc";
console.log("ammmda running");

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/en/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
