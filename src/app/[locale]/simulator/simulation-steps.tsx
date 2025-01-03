// Source: src/app/[locale]/simulator/simulation-steps.tsx

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
import { LoanSummary } from "@/app/utils/loanCalculator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define explicit types for better type safety
type SimulationStep = 1 | 2 | 3;
type StepStatus = "pending" | "in-progress" | "completed" | "error";

type StepStatusState = Record<SimulationStep, StepStatus>;

const ANIMATION_DURATION = 0.3;

const stepAnimationVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Get the appropriate status class for step indicators
 */
const getStepStatusClass = (status: StepStatus): string => {
  switch (status) {
    case "completed":
      return "bg-primary text-primary-foreground ring-2 ring-primary";
    case "in-progress":
      return "bg-primary text-primary-foreground animate-pulse";
    case "error":
      return "bg-destructive text-destructive-foreground ring-2 ring-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
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

  // const { toast } = useToast();

  const updateStepStatus = (
    currentStep: SimulationStep,
    status: StepStatus,
    nextStep?: SimulationStep,
  ) => {
    setStepStatus((prev) => ({ ...prev, [currentStep]: status }));
    if (nextStep) {
      setStep(nextStep);
      setStepStatus((prev) => ({ ...prev, [nextStep]: "in-progress" }));
    }
  };

  const handleSimulationComplete: SimulatorFormProps["onSimulationComplete"] = (
    data,
  ) => {
    try {
      const summary = calculateLoan(data);
      setSimulationData(data);
      setLoanSummary(summary);
      updateStepStatus(1, "completed", 2);
      toast({
        title: t("simulationSuccess"),
        description: t("proceedToSummary"),
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      updateStepStatus(1, "error");
      toast({
        title: t("calculationError"),
        description: t("tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const handleSummaryComplete = () => {
    updateStepStatus(2, "completed", 3);
    toast({
      title: t("summaryReviewed"),
      description: t("proceedToSubmission"),
      variant: "default",
    });
  };

  const handleSendComplete = () => {
    updateStepStatus(3, "completed");
    toast({
      title: t("simulationSent"),
      description: t("thankYou"),
      variant: "default",
    });
    setTimeout(resetSimulation, 3000);
  };

  const handleValidationError = (errorMessage?: string) => {
    updateStepStatus(1, "error");
    toast({
      title: t("validationError"),
      description: errorMessage || t("checkFields"),
      variant: "destructive",
    });
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

  const handleBack = () => {
    updateStepStatus(2, "pending", 1); // Navigate back to step 1
  };

  const StepIndicator = ({ stepNumber }: { stepNumber: SimulationStep }) => (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
          getStepStatusClass(stepStatus[stepNumber]),
        )}
        role="status"
        aria-label={`Step ${stepNumber}: ${stepStatus[stepNumber]}`}
      >
        {stepNumber}
      </div>
      <span className="mt-2 text-sm font-medium">{t(`step${stepNumber}`)}</span>
      <span className="text-xs text-muted-foreground">
        {t(`step${stepNumber}Status.${stepStatus[stepNumber]}`)}
      </span>
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
          onBack={handleBack}
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
        <div
          className="mb-8"
          role="progressbar"
          aria-valuenow={calculateProgress(step)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
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
