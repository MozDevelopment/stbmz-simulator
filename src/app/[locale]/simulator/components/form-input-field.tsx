// components/form/FormInputField.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormInputFieldProps } from "../types";

export function FormInputField({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete="on"
              {...field}
              value={typeof field.value === "boolean" ? "" : field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
