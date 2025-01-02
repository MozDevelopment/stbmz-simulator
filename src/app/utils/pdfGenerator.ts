import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { LoanSummary } from "./loanCalculator";

/**
 * Generates a PDF document containing the loan amortization table.
 * @param loanSummary The loan summary containing the amortization schedule
 * @returns A Promise that resolves with the generated PDF as a Blob
 */
export async function generatePDF(loanSummary: LoanSummary): Promise<Blob> {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text("Loan Amortization Schedule", 14, 22);

  // Add loan summary
  doc.setFontSize(12);
  doc.text(
    `Loan Amount: ${loanSummary.totalAmount.toFixed(2)} ${
      loanSummary.currency
    }`,
    14,
    32,
  );
  doc.text(`Interest Rate: ${loanSummary.interestRate.toFixed(2)}%`, 14, 38);
  doc.text(`Term: ${loanSummary.term} months`, 14, 44);
  doc.text(
    `Monthly Payment: ${loanSummary.monthlyPayment.toFixed(2)} ${
      loanSummary.currency
    }`,
    14,
    50,
  );

  // Add amortization table
  doc.autoTable({
    startY: 60,
    head: [["Month", "Payment", "Interest", "Principal", "Balance"]],
    body: loanSummary.schedule.map((entry) => [
      entry.month,
      entry.payment.toFixed(2),
      entry.monthlyInterest.toFixed(2),
      entry.amortization.toFixed(2),
      entry.balance.toFixed(2),
    ]),
    foot: [
      [
        "Total",
        loanSummary.schedule
          .reduce((sum, entry) => sum + entry.payment, 0)
          .toFixed(2),
        loanSummary.schedule
          .reduce((sum, entry) => sum + entry.monthlyInterest, 0)
          .toFixed(2),
        loanSummary.schedule
          .reduce((sum, entry) => sum + entry.amortization, 0)
          .toFixed(2),
        "",
      ],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    footStyles: {
      fillColor: [189, 195, 199],
      textColor: 50,
      fontStyle: "bold",
    },
  });

  return doc.output("blob");
}
