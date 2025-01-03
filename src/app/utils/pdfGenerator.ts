// import { jsPDF } from "jspdf";
// // import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import { LoanSummary } from "./loanCalculator";

// /**
//  * Generates a PDF document containing the loan amortization table.
//  * @param loanSummary The loan summary containing the amortization schedule
//  * @returns A Promise that resolves with the generated PDF as a Blob
//  */
// export async function generatePDF(loanSummary: LoanSummary): Promise<Blob> {
//   const doc = new jsPDF();

//   // Add title
//   doc.setFontSize(18);
//   doc.text("Loan Amortization Schedule", 14, 22);

//   // Add loan summary
//   doc.setFontSize(12);
//   doc.text(
//     `Loan Amount: ${loanSummary.totalAmount.toFixed(2)} ${
//       loanSummary.currency
//     }`,
//     14,
//     32
//   );
//   doc.text(`Interest Rate: ${loanSummary.interestRate.toFixed(2)}%`, 14, 38);
//   doc.text(`Term: ${loanSummary.term} months`, 14, 44);
//   doc.text(
//     `Monthly Payment: ${loanSummary.monthlyPayment.toFixed(2)} ${
//       loanSummary.currency
//     }`,
//     14,
//     50
//   );

//   // Add amortization table
//   autoTable(doc, {
//     startY: 60,
//     head: [["Month", "Payment", "Interest", "Principal", "Balance"]],
//     body: loanSummary.schedule.map((entry) => [
//       entry.month,
//       entry.payment.toFixed(2),
//       entry.monthlyInterest.toFixed(2),
//       entry.amortization.toFixed(2),
//       entry.balance.toFixed(2),
//     ]),
//     foot: [
//       [
//         "Total",
//         loanSummary.schedule
//           .reduce((sum, entry) => sum + entry.payment, 0)
//           .toFixed(2),
//         loanSummary.schedule
//           .reduce((sum, entry) => sum + entry.monthlyInterest, 0)
//           .toFixed(2),
//         loanSummary.schedule
//           .reduce((sum, entry) => sum + entry.amortization, 0)
//           .toFixed(2),
//         "",
//       ],
//     ],
//     theme: "striped",
//     headStyles: {
//       fillColor: [41, 128, 185],
//       textColor: 255,
//       fontStyle: "bold",
//     },
//     bodyStyles: {
//       textColor: 50,
//     },
//     alternateRowStyles: {
//       fillColor: [245, 245, 245],
//     },
//     footStyles: {
//       fillColor: [189, 195, 199],
//       textColor: 50,
//       fontStyle: "bold",
//     },
//   });

//   return doc.output("blob");
// }

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { LoanSummary } from "./loanCalculator";

/**
 * Generates a PDF document containing the loan amortization table.
 * @param loanSummary The loan summary containing the amortization schedule
 * @returns A Promise that resolves with the generated PDF as a Blob
 */
export async function generatePDF(loanSummary: LoanSummary): Promise<Blob> {
  // Create new document
  const doc = new jsPDF();

  // Add logo
  const logoWidth = 30;
  const logoHeight = 30;
  const pageWidth = doc.internal.pageSize.width;
  doc.addImage(
    "/sb_logo_xl.png",
    "PNG",
    pageWidth - logoWidth - 20,
    10,
    logoWidth,
    logoHeight,
  );

  // Add title
  doc.setFontSize(14);
  doc.text("PLANO DE PAGAMENTO", 14, 20);

  // Add date and time
  const now = new Date();
  doc.setFontSize(10);
  doc.text(`DATA: ${now.toLocaleDateString("pt-PT")}`, 14, 30);
  doc.text(
    `HORA: ${now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`,
    14,
    35,
  );

  // Add simulation details
  doc.setFillColor(0, 102, 51); // Dark green
  doc.rect(14, 45, pageWidth - 28, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Simulação", 16, 50);
  doc.setTextColor(0, 0, 0);

  // Add loan details
  doc.setFontSize(10);
  const startY = 60;
  const lineHeight = 5;
  doc.text(`PRODUTO: Crédito Pessoal`, 14, startY);
  doc.text(`MOEDA: ${loanSummary.currency}`, pageWidth / 2, startY);
  doc.text(
    `MONTANTE DE FINANCIAMENTO: ${loanSummary.totalAmount.toLocaleString("pt-PT")}`,
    14,
    startY + lineHeight,
  );
  doc.text(
    `PRAZO DE FINANCIAMENTO (MESES): ${loanSummary.term}`,
    pageWidth / 2,
    startY + lineHeight,
  );
  doc.text(
    `DATA DO 1º PAGAMENTO: ${new Date().toLocaleDateString("pt-PT")}`,
    14,
    startY + lineHeight * 2,
  );
  doc.text(
    `TAXA DE JURO ANUAL: ${loanSummary.interestRate}%`,
    pageWidth / 2,
    startY + lineHeight * 2,
  );

  // Add amortization table
  autoTable(doc, {
    startY: startY + lineHeight * 4,
    head: [
      [
        "MESES",
        "DATA",
        "CAPITAL EM DÍVIDA",
        "JUROS MENSAIS",
        "PRESTAÇÃO",
        "AMORTIZAÇÃO",
      ],
    ],
    body: loanSummary.schedule.map((entry, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() + index);
      return [
        entry.month,
        date.toLocaleDateString("pt-PT"),
        entry.balance.toLocaleString("pt-PT", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        entry.monthlyInterest.toLocaleString("pt-PT", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        entry.payment.toLocaleString("pt-PT", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        entry.amortization.toLocaleString("pt-PT", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      ];
    }),
    foot: [
      [
        "TOTAL:",
        "",
        "",
        loanSummary.schedule
          .reduce((sum, entry) => sum + entry.monthlyInterest, 0)
          .toLocaleString("pt-PT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        "",
        loanSummary.schedule
          .reduce((sum, entry) => sum + entry.amortization, 0)
          .toLocaleString("pt-PT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [0, 102, 51], // Dark green
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: 50,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    footStyles: {
      fillColor: [220, 220, 220],
      textColor: 50,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 20 }, // MESES
      1: { cellWidth: 25 }, // DATA
      2: { cellWidth: 35 }, // CAPITAL EM DÍVIDA
      3: { cellWidth: 30 }, // JUROS MENSAIS
      4: { cellWidth: 30 }, // PRESTAÇÃO
      5: { cellWidth: 30 }, // AMORTIZAÇÃO
    },
  });

  return doc.output("blob");
}
