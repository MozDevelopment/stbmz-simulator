//app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from 'next-intl/server';


export const metadata: Metadata = {
  title: 'Simulador Financeiro',
  description: 'Simule diferentes tipos de produtos financeiros',
};

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
export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {


  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body  >
        <NextIntlClientProvider messages={messages}>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </NextThemesProvider>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
