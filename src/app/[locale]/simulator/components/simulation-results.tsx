'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SimulationFormData } from '../types'
import { Check, AlertTriangle } from 'lucide-react'

interface SimulationResultsProps {
    simulationData: SimulationFormData
    onContinue: () => void
}

export function SimulationResults({ simulationData, onContinue }: SimulationResultsProps) {
    const t = useTranslations('SimulationResults')

    // This is a placeholder function. In a real application, you would calculate these values based on the simulationData.
    const calculateResults = (data: SimulationFormData) => ({
        hasCapacity: data.monthlyIncome > data.requestedAmount / 10,
        effortRate: 29,
        availableIncome: 50000,
        financingAmount: 2000000,
        financingTerm: 120,
        interestRate: 12,
        taeg: 14,
        monthlyPayment: 25000,
        singlePremium: 0,
    })

    const results = calculateResults(simulationData)

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('summaryTitle')}</CardTitle>
                <CardDescription>{t('summaryDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    {results.hasCapacity ? (
                        <div className="flex items-center text-green-600">
                            <Check className="mr-2" />
                            <span>{t('withCapacity')}</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-red-600">
                            <AlertTriangle className="mr-2" />
                            <span>{t('withoutCapacity')}</span>
                        </div>
                    )}
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('parameter')}</TableHead>
                            <TableHead>{t('value')}</TableHead>
                            <TableHead>{t('description')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{t('effortRate')}</TableCell>
                            <TableCell>{results.effortRate}%</TableCell>
                            <TableCell>{t('effortRateDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('availableIncome')}</TableCell>
                            <TableCell>{results.availableIncome} {t('meticais')}</TableCell>
                            <TableCell>{t('availableIncomeDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('financingAmount')}</TableCell>
                            <TableCell>{results.financingAmount} {t('meticais')}</TableCell>
                            <TableCell>{t('financingAmountDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('financingTerm')}</TableCell>
                            <TableCell>{results.financingTerm} {t('months')}</TableCell>
                            <TableCell>{t('financingTermDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('interestRate')}</TableCell>
                            <TableCell>{results.interestRate}%</TableCell>
                            <TableCell>{t('interestRateDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('taeg')}</TableCell>
                            <TableCell>{results.taeg}%</TableCell>
                            <TableCell>{t('taegDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('monthlyPayment')}</TableCell>
                            <TableCell>{results.monthlyPayment} {t('meticais')}</TableCell>
                            <TableCell>{t('monthlyPaymentDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('singlePremium')}</TableCell>
                            <TableCell>{results.singlePremium} {t('meticais')}</TableCell>
                            <TableCell>{t('singlePremiumDescription')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button onClick={onContinue}>{t('sendToBank')}</Button>
            </CardFooter>
        </Card>
    )
}

