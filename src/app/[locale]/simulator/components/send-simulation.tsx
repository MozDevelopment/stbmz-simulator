// Source: src/app/[locale]/simulator/components/send-simulation.tsx

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimulationFormData } from "../types";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { LoanSummary } from "@/app/utils/loanCalculator";

interface SendSimulationProps {
  simulationData: SimulationFormData;
  loanSummary: LoanSummary;
  onComplete: () => void;
}

export function SendSimulation({
  simulationData,
  loanSummary,
  onComplete,
}: SendSimulationProps) {
  const t = useTranslations("SendSimulation");
  const [isSending, setIsSending] = useState(false);

  const handleSendSimulation = async () => {
    setIsSending(true);
    try {
      // Here you would implement the logic to send the email and SMS
      // using the Twilio API or your preferred service
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API call
      toast.success(t("simulationSentSuccess"));
      onComplete();
    } catch (error) {
      console.error("Error sending simulation:", error);
      toast.error(t("simulationSentError"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{t("emailConfirmation")}</p>
        <p>{t("smsConfirmation")}</p>
        <p>{t("recipientName", { name: simulationData.fullName })}</p>
        <p>{t("recipientEmail", { email: simulationData.email })}</p>
        <p>{t("recipientPhone", { phone: simulationData.phoneNumber })}</p>
        <div className="mt-4">
          <h3 className="font-semibold">{t("simulationSummary")}</h3>
          <p>
            {t("loanAmount", {
              amount: loanSummary.totalAmount.toFixed(2),
              currency: simulationData.currency,
            })}
          </p>
          <p>
            {t("monthlyPayment", {
              amount: loanSummary.monthlyPayment.toFixed(2),
              currency: simulationData.currency,
            })}
          </p>
          <p>{t("term", { term: loanSummary.term })}</p>
          <p>{t("taeg", { taeg: loanSummary.taeg.toFixed(2) })}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSendSimulation}
          disabled={isSending}
          className="flex items-center space-x-2"
        >
          <Send size={18} />
          <span>{isSending ? t("sending") : t("send")}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
