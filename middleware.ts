import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

//TODO: add security headers
// export default function middleware(request: NextRequest) {
//   const response = intlMiddleware(request);

//   if (response) {
//     // Add security headers
//     response.headers.set('X-Frame-Options', 'DENY');
//     response.headers.set('X-Content-Type-Options', 'nosniff');
//     response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
//     response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
//   }

//   return response;
// }

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(pt|en)/:path*", // Match all locales

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
