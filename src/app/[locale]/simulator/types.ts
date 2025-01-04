//app/[locale]/simulator/types.ts

import { Control } from "react-hook-form";
import * as z from "zod";

export type SimulationFormData = z.infer<typeof formSchema>;

export const PRODUCT_TYPES = [
  { value: "personalLoan", label: "Crédito Pessoal" },
  { value: "homeLoan", label: "Crédito Habitação" },
  { value: "vehicleLoan", label: "Leasing Mobiliário" },
  { value: "businessLoan", label: "Leasing Imobiliário" },
] as const;

export interface FormInputFieldProps {
  control: Control<SimulationFormData>;
  name: keyof SimulationFormData;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "number";
}

export interface SimulatorFormProps {
  onSimulationComplete: (values: SimulationFormData) => void;
  onValidationError: (errorMessage: string) => void;
}

export const formSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  monthlyIncome: z.number().min(1, "Rendimento mensal é obrigatório"),
  otherIncome: z.number().optional(),
  requestedAmount: z.number().min(1, "Montante é obrigatório"),
  productType: z.enum([
    "personalLoan",
    "homeLoan",
    "vehicleLoan",
    "businessLoan",
  ]),
  term: z.number().min(1, "Prazo é obrigatório"),
  includeInsurance: z.boolean().default(false),
  initialContribution: z.number().optional(),
  currency: z.string().default("MZN"),
});

export const formContactSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phoneNumber: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  email: z.string().email("Email inválido"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
});

export interface PaymentPlanProps {
  initialAmount: number;
  interestRate: number;
  term: number;
}

export type PaymentPlan = {
  month: number;
  date: string;
  remainingCapital: number;
  monthlyInterest: number;
  payment: number;
  amortization: number;
};
