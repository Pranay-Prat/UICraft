import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/inngest", // Add this just to be safe in the clerk logic too
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * - api/inngest (The critical exclusion)
     * - _next (Next.js internals)
     * - Any file with an extension (static files like .css, .png, etc.)
     */
    '/((?!api/inngest|_next|.*\\..*).*)',
  ],
};