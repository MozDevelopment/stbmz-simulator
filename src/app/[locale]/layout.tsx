//app/[locale]/layout.tsx

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { ValidLocale } from "@/i18n/types";

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

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
