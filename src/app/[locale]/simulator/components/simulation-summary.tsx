// Source: src/app/[locale]/simulator/components/simulation-summary.tsx

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimulationFormData } from "../types";
import {
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generatePDF } from "@/app/utils/pdfGenerator";
import { toast } from "sonner";
import { LoanSummary } from "@/app/utils/loanCalculator";

interface SimulationSummaryProps {
  simulationData: SimulationFormData;
  loanSummary: LoanSummary;
  onContinue: () => void;
  onBack: () => void;
}

const ROWS_PER_PAGE = 12;

export function SimulationSummary({
  simulationData,
  loanSummary,
  onContinue,
  onBack,
}: SimulationSummaryProps) {
  const t = useTranslations("SimulationResults");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAmortizationTable, setShowAmortizationTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(loanSummary.schedule.length / ROWS_PER_PAGE);

  const handleDownloadAmortizationTable = async () => {
    try {
      const pdfBlob = await generatePDF(loanSummary);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "amortization_table.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t("downloadSuccess"));
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t("downloadError"));
    }
  };

  const handleViewAmortizationTable = () => {
    setShowAmortizationTable(!showAmortizationTable);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedSchedule = loanSummary.schedule.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("summaryTitle")}</CardTitle>
        <CardDescription>{t("summaryDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {loanSummary.hasCapacity ? (
            <div className="flex items-center text-green-600">
              <Check className="mr-2" />
              <span>{t("withCapacity")}</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="mr-2" />
              <span>{t("withoutCapacity")}</span>
            </div>
          )}
        </div>
        {!loanSummary.hasCapacity && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {t("noCapacityMessage")}
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("parameter")}</TableHead>
              <TableHead>{t("value")}</TableHead>
              <TableHead>{t("description")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t("effortRate")}</TableCell>
              <TableCell>{loanSummary.effortRate.toFixed(2)}%</TableCell>
              <TableCell>{t("effortRateDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("availableIncome")}</TableCell>
              <TableCell>
                {loanSummary.availableIncome.toFixed(2)}{" "}
                {simulationData.currency}
              </TableCell>
              <TableCell>{t("availableIncomeDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("financingAmount")}</TableCell>
              <TableCell>
                {loanSummary.totalAmount.toFixed(2)} {simulationData.currency}
              </TableCell>
              <TableCell>{t("financingAmountDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("financingTerm")}</TableCell>
              <TableCell>
                {loanSummary.term} {t("months")}
              </TableCell>
              <TableCell>{t("financingTermDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("interestRate")}</TableCell>
              <TableCell>{loanSummary.interestRate.toFixed(2)}%</TableCell>
              <TableCell>{t("interestRateDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("taeg")}</TableCell>
              <TableCell>{loanSummary.taeg.toFixed(2)}%</TableCell>
              <TableCell>{t("taegDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("monthlyPayment")}</TableCell>
              <TableCell>
                {loanSummary.monthlyPayment.toFixed(2)}{" "}
                {simulationData.currency}
              </TableCell>
              <TableCell>{t("monthlyPaymentDescription")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("totalCost")}</TableCell>
              <TableCell>
                {loanSummary.totalCost.toFixed(2)} {simulationData.currency}
              </TableCell>
              <TableCell>{t("totalCostDescription")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${!termsAccepted ? "text-red-500 font-bold" : ""}`}
          >
            {t("acceptTerms")}
          </label>
        </div>
        {!termsAccepted && (
          <p className="mt-2 text-sm text-red-500">{t("acceptTermsWarning")}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={18} />
          <span>{t("backToForm")}</span>
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDownloadAmortizationTable}
                className="flex items-center space-x-2"
              >
                <Download size={18} />
                <span>{t("downloadAmortizationTable")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("downloadTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleViewAmortizationTable}
                className="flex items-center space-x-2"
              >
                <Eye size={18} />
                <span>
                  {showAmortizationTable
                    ? t("hideAmortizationTable")
                    : t("viewAmortizationTable")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("viewTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={onContinue} disabled={!termsAccepted}>
          {t("continue")}
        </Button>
      </CardFooter>
      {showAmortizationTable && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("amortizationTableTitle")}</CardTitle>
            <CardDescription>
              {t("amortizationTableDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("month")}</TableHead>
                  <TableHead>{t("payment")}</TableHead>
                  <TableHead>{t("interest")}</TableHead>
                  <TableHead>{t("principal")}</TableHead>
                  <TableHead>{t("balance")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSchedule.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.month}</TableCell>
                    <TableCell>{entry.payment.toFixed(2)}</TableCell>
                    <TableCell>{entry.monthlyInterest.toFixed(2)}</TableCell>
                    <TableCell>{entry.amortization.toFixed(2)}</TableCell>
                    <TableCell>{entry.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>
              {t("page")} {currentPage} {t("of")} {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="sm"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                size="sm"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </Card>
  );
}
