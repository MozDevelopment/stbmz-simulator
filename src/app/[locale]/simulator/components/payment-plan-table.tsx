"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PaymentPlanProps } from "../types";

export function PaymentPlanTable({ initialAmount, interestRate, term }: PaymentPlanProps) {
    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlyPayment = (initialAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) /
        (Math.pow(1 + monthlyInterestRate, term) - 1);

    const generatePaymentPlan = () => {
        let remainingBalance = initialAmount;
        const rows = [];
        const startDate = new Date();

        for (let month = 1; month <= term; month++) {
            const interestPayment = remainingBalance * monthlyInterestRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;

            rows.push({
                month,
                date: format(addMonths(startDate, month - 1), "dd/MM/yyyy", { locale: ptBR }),
                balance: Math.max(0, remainingBalance),
                interest: interestPayment,
                payment: monthlyPayment,
                principal: principalPayment,
            });
        }

        return rows;
    };

    const paymentPlan = generatePaymentPlan();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Capital Em Dívida</TableHead>
                    <TableHead>Juros Mensais</TableHead>
                    <TableHead>Prestação</TableHead>
                    <TableHead>Amortização</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paymentPlan.map((row) => (
                    <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}</TableCell>
                        <TableCell>{row.interest.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}</TableCell>
                        <TableCell>{row.payment.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}</TableCell>
                        <TableCell>{row.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}