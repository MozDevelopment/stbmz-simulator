// Source: src/app/utils/loancalculator.ts

import { addMonths } from "date-fns";

export interface LoanConfig {
  interestRate: number; // Taxa de juro anual (%)
  term: number; // Prazo em meses
  amount: number; // Montante solicitado
  processingFee?: number; // Comissão de processamento
  organizationFee?: number; // Comissão de organização
  stampDutyRate?: number; // Taxa de imposto de selo sobre capital (%)
  interestStampDutyRate?: number; // Taxa de imposto de selo sobre juros (%)
  insurance?: number; // Valor do seguro
  currency: string; // Moeda (ex: MZN)
  startDate?: Date; // Data de início do empréstimo
}

export interface PaymentScheduleEntry {
  month: number;
  dueDate: Date;
  remainingCapital: number;
  monthlyInterest: number;
  payment: number;
  amortization: number;
  balance: number;
  cumulativeInterest: number;
  cumulativeAmortization: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  totalCost: number;
  taeg: number;
  term: number;
  currency: string;
  schedule: PaymentScheduleEntry[];
  processingFee: number;
  organizationFee: number;
  stampDuty: number;
  interestStampDuty: number;
  insurance: number;
  effortRate: number;
  hasCapacity: boolean;
  availableIncome: number;
  interestRate: number;
}

export class LoanCalculator {
  private config: Required<LoanConfig>;

  constructor(config: LoanConfig) {
    this.config = {
      processingFee: 0,
      organizationFee: 0,
      stampDutyRate: 0,
      interestStampDutyRate: 0,
      insurance: 0,
      startDate: new Date(),
      ...config,
    };
  }

  private calculateMonthlyPayment(): number {
    const monthlyRate = this.config.interestRate / 12 / 100;
    const numberOfPayments = this.config.term;
    const presentValue = this.config.amount;

    return (
      (presentValue *
        monthlyRate *
        Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  }

  public calculateTAEG(): number {
    const totalFees =
      this.config.processingFee +
      this.config.organizationFee +
      (this.config.amount * this.config.stampDutyRate) / 100;

    const monthlyPayment = this.calculateMonthlyPayment();
    const totalInterest =
      monthlyPayment * this.config.term - this.config.amount;
    const interestStampDuty =
      (totalInterest * this.config.interestStampDutyRate) / 100;

    const totalCost =
      totalFees + totalInterest + interestStampDuty + this.config.insurance;

    // TAEG é calculada como taxa anual efetiva
    const taeg =
      Math.pow(
        totalCost / this.config.amount + 1,
        1 / (this.config.term / 12),
      ) - 1;
    return taeg * 100;
  }

  public calculateEffortRate(monthlyIncome: number): number {
    const monthlyPayment = this.calculateMonthlyPayment();
    return (monthlyPayment / monthlyIncome) * 100;
  }

  public generatePaymentSchedule(): PaymentScheduleEntry[] {
    const schedule: PaymentScheduleEntry[] = [];
    const monthlyPayment = this.calculateMonthlyPayment();
    const monthlyRate = this.config.interestRate / 12 / 100;
    let remainingCapital = this.config.amount;
    let cumulativeInterest = 0;
    let cumulativeAmortization = 0;

    for (let month = 1; month <= this.config.term; month++) {
      const monthlyInterest = remainingCapital * monthlyRate;
      const amortization = monthlyPayment - monthlyInterest;
      cumulativeInterest += monthlyInterest;
      cumulativeAmortization += amortization;

      const dueDate = addMonths(this.config.startDate, month);

      remainingCapital -= amortization;

      schedule.push({
        month,
        dueDate,
        remainingCapital: Math.max(0, remainingCapital),
        monthlyInterest,
        payment: monthlyPayment,
        amortization,
        balance: remainingCapital,
        cumulativeInterest,
        cumulativeAmortization,
      });
    }

    return schedule;
  }

  public generateLoanSummary(): LoanSummary {
    const monthlyPayment = this.calculateMonthlyPayment();
    const schedule = this.generatePaymentSchedule();
    const totalInterest = schedule[schedule.length - 1].cumulativeInterest;
    const stampDuty = (this.config.amount * this.config.stampDutyRate) / 100;
    const interestStampDuty =
      (totalInterest * this.config.interestStampDutyRate) / 100;

    return {
      monthlyPayment,
      totalAmount: this.config.amount,
      totalInterest,
      totalCost:
        this.config.amount +
        totalInterest +
        this.config.processingFee +
        this.config.organizationFee +
        stampDuty +
        interestStampDuty +
        this.config.insurance,
      taeg: this.calculateTAEG(),
      term: this.config.term,
      currency: this.config.currency,
      schedule,
      processingFee: this.config.processingFee,
      organizationFee: this.config.organizationFee,
      stampDuty,
      interestStampDuty,
      insurance: this.config.insurance,
      effortRate: 0, // This will be calculated later
      hasCapacity: false, // This will be determined later
      availableIncome: 0, // This will be calculated later
      interestRate: this.config.interestRate, // Add this line
    };
  }
}
