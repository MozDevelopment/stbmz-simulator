// Source: src/app/[locale]/simulator/components/simulation-steps.tsx

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SendSimulation } from "./components/send-simulation";
import { SimulationSummary } from "./components/simulation-summary";
import { PersonalInfoForm } from "./components/personal-info-form";
import { motion, AnimatePresence } from "framer-motion";
import { SimulationFormData, SimulatorFormProps } from "./types";
import { calculateLoan } from "@/app/utils/loanCalculations";
import { toast } from "sonner";
import { LoanSummary } from "@/app/utils/loanCalculator";

// Define explicit types for better type safety
type SimulationStep = 1 | 2 | 3;

type StepStatusState = Record<
  SimulationStep,
  "in-progress" | "pending" | "completed"
>;

const ANIMATION_DURATION = 0.3;

const stepAnimationVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * SimulationSteps component manages the flow of the loan simulation process.
 */
export function SimulationSteps() {
  const t = useTranslations("SimulationSteps");
  const [step, setStep] = useState<SimulationStep>(1);
  const [simulationData, setSimulationData] =
    useState<SimulationFormData | null>(null);
  const [loanSummary, setLoanSummary] = useState<LoanSummary | null>(null);
  const [stepStatus, setStepStatus] = useState<StepStatusState>({
    1: "in-progress",
    2: "pending",
    3: "pending",
  });

  const updateStepStatus = (
    currentStep: SimulationStep,
    status: "completed",
    nextStep?: SimulationStep,
  ) => {
    setStepStatus({ ...stepStatus, [currentStep]: status });
    if (nextStep) {
      setStep(nextStep);
    }
  };

  const handleSimulationComplete: SimulatorFormProps["onSimulationComplete"] = (
    data,
  ) => {
    setSimulationData(data);
    const summary = calculateLoan(data);
    setLoanSummary(summary);
    updateStepStatus(1, "completed", 2);
  };

  const handleSummaryComplete = () => {
    updateStepStatus(2, "completed", 3);
  };

  const handleSendComplete = () => {
    toast.success(t("simulationSent"));
    resetSimulation();
  };

  const handleValidationError = () => {
    toast.error(t("validationError"));
  };

  const resetSimulation = () => {
    setStep(1);
    setSimulationData(null);
    setLoanSummary(null);
    setStepStatus({
      1: "in-progress",
      2: "pending",
      3: "pending",
    });
  };

  const calculateProgress = (currentStep: SimulationStep) => {
    return (currentStep / 3) * 100;
  };

  const StepIndicator = ({ stepNumber }: { stepNumber: SimulationStep }) => (
    <div
      className={`flex flex-col items-center ${step >= stepNumber ? "text-primary" : "text-muted-foreground"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        {stepNumber}
      </div>
      <span className="mt-2 text-sm">{t(`step${stepNumber}`)}</span>
    </div>
  );

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <PersonalInfoForm
          onSimulationComplete={handleSimulationComplete}
          onValidationError={handleValidationError}
        />
      );
    }

    if (!simulationData || !loanSummary) return null;

    if (step === 2) {
      return (
        <SimulationSummary
          simulationData={simulationData}
          loanSummary={loanSummary}
          onContinue={handleSummaryComplete}
        />
      );
    }

    if (step === 3) {
      return (
        <SendSimulation
          simulationData={simulationData}
          loanSummary={loanSummary}
          onComplete={handleSendComplete}
        />
      );
    }
  };

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
  );
}
