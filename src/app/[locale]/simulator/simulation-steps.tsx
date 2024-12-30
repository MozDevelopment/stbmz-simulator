'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SendSimulation } from './components/send-simulation'
import { SimulationSummary } from './components/simulation-summary'
import { PersonalInfoForm } from './components/personal-info-form'
import { motion, AnimatePresence } from "framer-motion"
import { SimulationFormData, SimulatorFormProps } from './types'



// Define explicit types for better type safety
type SimulationStep = 1 | 2 | 3
type StepStatus = 'pending' | 'in-progress' | 'completed' | 'error'

interface StepStatusState {
    [key: number]: StepStatus
}

// Constants to avoid magic numbers and improve maintainability
const TOTAL_STEPS = 3
const ANIMATION_DURATION = 0.3

// Separate animation variants for cleaner code
const stepAnimationVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
}

// Helper function to calculate progress
const calculateProgress = (currentStep: SimulationStep): number =>
    (currentStep / TOTAL_STEPS) * 100

// Helper function to get step status class
const getStepStatusClass = (status: StepStatus): string => {
    const statusClasses = {
        completed: 'bg-green-500',
        'in-progress': 'bg-blue-500',
        error: 'bg-red-500',
        pending: 'bg-gray-300',
    }
    return statusClasses[status]
}

export function SimulationSteps() {
    const t = useTranslations('SimulationSteps')
    const [step, setStep] = useState<SimulationStep>(1)
    const [simulationData, setSimulationData] = useState<SimulationFormData | null>(null)
    const [stepStatus, setStepStatus] = useState<StepStatusState>({
        1: 'in-progress',
        2: 'pending',
        3: 'pending'
    })

    // Separate handlers into more specific functions
    const updateStepStatus = (
        currentStep: SimulationStep,
        status: StepStatus,
        nextStep?: SimulationStep
    ) => {
        setStepStatus(prev => ({ ...prev, [currentStep]: status }))
        if (nextStep) {
            setStep(nextStep)
            setStepStatus(prev => ({ ...prev, [nextStep]: 'in-progress' }))
        }
    }

    const handleSimulationComplete: SimulatorFormProps['onSimulationComplete'] = (data) => {
        setSimulationData(data)
        updateStepStatus(1, 'completed', 2)
    }

    const handleSummaryComplete = () => {
        updateStepStatus(2, 'completed', 3)
    }

    const handleSendComplete = () => {
        updateStepStatus(3, 'completed')
    }

    const handleValidationError: SimulatorFormProps['onValidationError'] = () => {
        updateStepStatus(1, 'error')
    }

    // Separate the step indicator component
    const StepIndicator = ({ stepNumber }: { stepNumber: SimulationStep }) => (
        <div className="flex flex-col items-center">
            <div
                className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${getStepStatusClass(stepStatus[stepNumber])} 
                    text-white font-bold mb-2`}
            >
                {stepNumber}
            </div>
            <span className="text-sm">{t(`step${stepNumber}`)}</span>
        </div>
    )

    // Render the current step content with proper type checking
    const renderStepContent = () => {
        if (step === 1) {
            return (
                <PersonalInfoForm
                    onSimulationComplete={handleSimulationComplete}
                    onValidationError={handleValidationError}
                />
            )
        }

        // Early return if no simulation data
        if (!simulationData) return null

        // Type guard to ensure simulationData matches the schema
        const isValidSimulationData = (data: SimulationFormData): data is SimulationFormData => {
            return (
                typeof data.fullName === 'string' &&
                typeof data.email === 'string' &&
                typeof data.phoneNumber === 'string' &&
                typeof data.monthlyIncome === 'number' &&
                typeof data.requestedAmount === 'number' &&
                typeof data.term === 'number' &&
                typeof data.includeInsurance === 'boolean' &&
                typeof data.currency === 'string' &&
                ('personal' === data.productType ||
                    'housing' === data.productType ||
                    'mobileLease' === data.productType ||
                    'propertyLease' === data.productType)
            )
        }

        if (!isValidSimulationData(simulationData)) {
            console.error('Invalid simulation data')
            return null
        }

        if (step === 2) {
            return (
                <SimulationSummary
                    simulationData={simulationData}
                    onContinue={handleSummaryComplete}
                />
            )
        }

        if (step === 3) {
            return (
                <SendSimulation
                    simulationData={simulationData}
                    onComplete={handleSendComplete}
                />
            )
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="pt-6">
                <div className="mb-8">
                    <Progress value={calculateProgress(step)} className="w-full" />
                </div>

                <div className="flex justify-between mb-8">
                    {([1, 2, 3] as SimulationStep[]).map((stepNumber) => (
                        <StepIndicator key={stepNumber} stepNumber={stepNumber} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`step-${step}`}
                        variants={stepAnimationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: ANIMATION_DURATION }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}

