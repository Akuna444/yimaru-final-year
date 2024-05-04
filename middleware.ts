import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "am"],
  defaultLocale: "en",
});

export default clerkMiddleware((auth, req) => {
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
