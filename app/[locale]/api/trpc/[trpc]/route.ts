import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc";
import { getLocale } from "next-intl/server";

const handler = async (req: Request) => {
  const locale = await getLocale();
  return fetchRequestHandler({
    endpoint: `/${locale}/api/trpc`,
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};
export { handler as GET, handler as POST };
