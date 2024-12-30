//

'use client'


import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SimulationFormData } from '../types'
import { Check, AlertTriangle } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

interface SimulationSummaryProps {
    simulationData: SimulationFormData
    onContinue: () => void
}

export function SimulationSummary({ simulationData, onContinue }: SimulationSummaryProps) {
    const t = useTranslations('SimulationResults')
    const [termsAccepted, setTermsAccepted] = useState(false)

    // This is a placeholder function. In a real application, you would calculate these values based on the simulationData.
    const calculateResults = (data: SimulationFormData) => ({
        hasCapacity: data.monthlyIncome > data.requestedAmount / 10,
        effortRate: 29,
        availableIncome: data.monthlyIncome * 0.7,
        financingAmount: data.requestedAmount,
        financingTerm: data.term,
        interestRate: 12,
        taeg: 14,
        monthlyPayment: (data.requestedAmount * (1 + 0.12)) / data.term,
        singlePremium: data.includeInsurance ? data.requestedAmount * 0.05 : 0,
    })

    const results = calculateResults(simulationData)

    const handleDownloadAmortizationTable = () => {
        // Implement download logic here
        console.log('Downloading amortization table...')
    }

    const handleViewAmortizationTable = () => {
        // Implement view logic here
        console.log('Viewing amortization table...')
    }

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
                {!results.hasCapacity && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        {t('noCapacityMessage')}
                    </div>
                )}
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
                            <TableCell>{results.availableIncome.toFixed(2)} {simulationData.currency}</TableCell>
                            <TableCell>{t('availableIncomeDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('financingAmount')}</TableCell>
                            <TableCell>{results.financingAmount.toFixed(2)} {simulationData.currency}</TableCell>
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
                            <TableCell>{results.monthlyPayment.toFixed(2)} {simulationData.currency}</TableCell>
                            <TableCell>{t('monthlyPaymentDescription')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t('singlePremium')}</TableCell>
                            <TableCell>{results.singlePremium.toFixed(2)} {simulationData.currency}</TableCell>
                            <TableCell>{t('singlePremiumDescription')}</TableCell>
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {t('acceptTerms')}
                    </label>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleDownloadAmortizationTable}>
                    {t('downloadAmortizationTable')}
                </Button>
                <Button onClick={handleViewAmortizationTable}>
                    {t('viewAmortizationTable')}
                </Button>
                <Button onClick={onContinue} disabled={!termsAccepted}>
                    {t('continue')}
                </Button>
            </CardFooter>
        </Card>
    )
}

