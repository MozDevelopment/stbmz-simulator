// Source: src/app/page.tsx

"use client";

import Link from "next/link";
import { Calculator, Car, Home, Building, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const t = useTranslations("Simulators");

  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const simulatorTypes = [
    {
      icon: Car,
      title: "vehicleLoan",
      color: "text-blue-500",
    },
    {
      icon: Home,
      title: "homeLoan",
      color: "text-green-500",
    },
    {
      icon: Building,
      title: "businessLoan",
      color: "text-purple-500",
    },
    {
      icon: Briefcase,
      title: "personalLoan",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {simulatorTypes.map(({ icon: Icon, title, color }) => (
            <Link
              href={{
                pathname: `/${locale}/simulator`,
                query: { productType: title },
              }}
              key={title}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer flex items-center space-x-4">
                <Icon className={`h-8 w-8 ${color}`} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t(`simulators.${title}`)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t(`simulators.${title}Description`)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
