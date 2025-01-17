//Source: src/app/[locale]/layout.tsx

import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/i18n/routing";
import { ValidLocale } from "@/i18n/types";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

/**
 * The root layout of the app that wraps each page.
 *
 * It provides the translation messages to the client, sets up the theme and
 * provides a Toaster component.
 *
 * @param {React.ReactNode} children - The children components of this layout.
 * @param {Object} params - The URL parameters.
 * @param {string} params.locale - The locale of the current page.
 *
 * @returns {JSX.Element} The root layout element.
 */

export default async function LocaleLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params to resolve
  const params = await paramsPromise;
  const locale = params.locale;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as ValidLocale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <body>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
      <Toaster />
    </body>
  );
}
