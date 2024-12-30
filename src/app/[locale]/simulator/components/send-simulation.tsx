'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SimulationFormData } from '../types'

interface SendSimulationProps {
    simulationData: SimulationFormData
    onComplete: () => void
}

export function SendSimulation({ simulationData: { fullName, email, phoneNumber }, onComplete }: SendSimulationProps) {
    const t = useTranslations('SendSimulation')
    const [isSending, setIsSending] = useState(false)

    const handleSendSimulation = async () => {
        setIsSending(true)
        try {
            // Here you would implement the logic to send the email and SMS
            // using the Twilio API or your preferred service
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
            onComplete()
        } catch (error) {
            console.error('Error sending simulation:', error)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t('emailConfirmation')}</p>
                <p>{t('smsConfirmation')}</p>
                <p>{t('recipientName', { name: fullName })}</p>
                <p>{t('recipientEmail', { email: email })}</p>
                <p>{t('recipientPhone', { phone: phoneNumber })}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSendSimulation} disabled={isSending}>
                    {isSending ? t('sending') : t('send')}
                </Button>
            </CardFooter>
        </Card>
    )
}

