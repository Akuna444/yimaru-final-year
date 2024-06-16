import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "am", "om"],
  defaultLocale: "am",
});

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/api(.*)",
  "/:locale/api/questions",
  "/api/webhook",
  "/:locale/api/webhook",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
