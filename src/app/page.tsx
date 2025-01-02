//app/page.tsx
import { Calculator } from "lucide-react";
import { useTranslations } from "next-intl";
import { SimulationSteps } from "./[locale]/simulator/simulation-steps";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <SimulationSteps />
        </div>
      </main>
    </div>
  );
}
