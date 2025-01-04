import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "pt"],

  localePrefix: "always",

  // Used when no locale matches
  defaultLocale: "pt",
  pathnames: {
    "/": "/",
    "/pathnames": {
      en: "/pathnames",
      pt: "/nomesdecaminhos",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
