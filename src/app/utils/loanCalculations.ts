// Source: src/app/utils/loanCalculations.ts

import { SimulationFormData } from "../[locale]/simulator/types";
import { LoanCalculator, LoanConfig, LoanSummary } from "./loanCalculator";

/**
 * Calculates the loan based on the provided simulation form data.
 * @param formData The simulation form data
 * @returns A LoanSummary object containing the calculated loan details
 */
export function calculateLoan(formData: SimulationFormData): LoanSummary {
  const loanConfig: LoanConfig = {
    interestRate: getInterestRate(formData.productType),
    term: formData.term,
    amount: formData.requestedAmount,
    processingFee: calculateProcessingFee(
      formData.requestedAmount,
      formData.productType,
    ),
    organizationFee: formData.requestedAmount * 0.0125, // 1.25% of the loan amount
    stampDutyRate: 0.5,
    interestStampDutyRate: 2,
    insurance: formData.includeInsurance
      ? calculateInsurance(formData.requestedAmount, formData.term)
      : 0,
    currency: formData.currency,
    startDate: new Date(),
  };

  const calculator = new LoanCalculator(loanConfig);
  const summary = calculator.generateLoanSummary();

  // Calculate effort rate
  const totalIncome = formData.monthlyIncome + (formData.otherIncome || 0);
  const effortRate = calculator.calculateEffortRate(totalIncome);

  // Determine if the applicant has capacity
  const hasCapacity = effortRate <= 30; // Example threshold, adjust as needed
  const availableIncome = totalIncome - summary.monthlyPayment;

  return {
    ...summary,
    effortRate,
    hasCapacity,
    availableIncome,
  };
}

/**
 * Gets the interest rate based on the product type.
 * @param productType The type of loan product
 * @returns The interest rate as a percentage
 */
function getInterestRate(
  productType: "personal" | "housing" | "mobileLease" | "propertyLease",
): number {
  const interestRates = {
    personal: 29.3,
    housing: 15.5,
    mobileLease: 18.75,
    propertyLease: 16.25,
  };

  return interestRates[productType] || 29.3; // Default to personal loan rate if not found
}

/**
 * Calculates the processing fee based on the loan amount and product type.
 * @param amount The loan amount
 * @param productType The type of loan product
 * @returns The calculated processing fee
 */
function calculateProcessingFee(
  amount: number,
  productType: "personal" | "housing" | "mobileLease" | "propertyLease",
): number {
  const baseRate = 0.01; // 1% base rate
  const productMultipliers = {
    personal: 1,
    housing: 0.8,
    mobileLease: 1.2,
    propertyLease: 1.1,
  };

  const multiplier = productMultipliers[productType] || 1;
  return amount * baseRate * multiplier;
}

/**
 * Calculates the insurance cost based on the loan amount and term.
 * @param amount The loan amount
 * @param term The loan term in months
 * @returns The calculated insurance cost
 */
function calculateInsurance(amount: number, term: number): number {
  const annualRate = 0.005; // 0.5% annual insurance rate
  const monthlyRate = annualRate / 12;
  return amount * monthlyRate * term;
}
