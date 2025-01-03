//app/[locale]/layout.tsx

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { ValidLocale } from "@/i18n/types";

import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!locale || !routing.locales.includes(locale as ValidLocale)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        {children}
        <Toaster />
      </NextIntlClientProvider>
    </html>
  );
}
