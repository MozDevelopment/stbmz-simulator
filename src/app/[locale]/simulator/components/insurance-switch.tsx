// components/form/InsuranceSwitch.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { FormValues } from "../types";

interface InsuranceSwitchProps {
  control: Control<FormValues>;
}

export function InsuranceSwitch({ control }: InsuranceSwitchProps) {
  return (
    <FormField
      control={control}
      name="includeInsurance"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Incluir Seguro</FormLabel>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label="Incluir Seguro"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
