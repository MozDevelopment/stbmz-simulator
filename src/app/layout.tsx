//Source: src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulador Financeiro",
  description: "Simule diferentes tipos de produtos financeiros",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-Pt">
      <body>{children}</body>
    </html>
  );
  // return <>{children}</>
}
