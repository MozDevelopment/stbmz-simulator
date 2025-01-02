import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface AmortizationEntry {
  month: number;
  date: string;
  remainingCapital: number;
  monthlyInterest: number;
  payment: number;
  amortization: number;
}

interface AmortizationTableProps {
  amortizationPlan: AmortizationEntry[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-MZ", { style: "currency", currency: "MZN" });
}

export function AmortizationTable({
  amortizationPlan,
}: AmortizationTableProps) {
  const t = useTranslations("AmortizationTable");
  const totalInterest = amortizationPlan.reduce(
    (sum, entry) => sum + entry.monthlyInterest,
    0,
  );
  const totalAmortization = amortizationPlan.reduce(
    (sum, entry) => sum + entry.amortization,
    0,
  );
  const totalPayments = amortizationPlan.reduce(
    (sum, entry) => sum + entry.payment,
    0,
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("month")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("remainingCapital")}</TableHead>
            <TableHead>{t("monthlyInterest")}</TableHead>
            <TableHead>{t("payment")}</TableHead>
            <TableHead>{t("amortization")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amortizationPlan.map((entry) => (
            <TableRow key={entry.month}>
              <TableCell>{entry.month}</TableCell>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{formatCurrency(entry.remainingCapital)}</TableCell>
              <TableCell>{formatCurrency(entry.monthlyInterest)}</TableCell>
              <TableCell>{formatCurrency(entry.payment)}</TableCell>
              <TableCell>{formatCurrency(entry.amortization)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="font-bold">
              {t("totals")}
            </TableCell>
            <TableCell className="font-bold">
              {formatCurrency(totalInterest)}
            </TableCell>
            <TableCell className="font-bold">
              {formatCurrency(totalPayments)}
            </TableCell>
            <TableCell className="font-bold">
              {formatCurrency(totalAmortization)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
