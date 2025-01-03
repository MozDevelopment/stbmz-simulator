// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { useTranslations } from "next-intl";

// const formSchema = z.object({
//   fullName: z.string().min(2, "Nome completo é obrigatório"),
//   email: z.string().email("E-mail inválido"),
//   phoneNumber: z.string().min(9, "Número de telefone inválido"),
//   monthlyIncome: z.number().min(1, "Rendimento mensal é obrigatório"),
//   otherIncome: z.number().optional(),
//   amount: z.number().min(1, "Montante desejado é obrigatório"),
//   productType: z.enum([
//     "creditoPessoal",
//     "creditoHabitacao",
//     "leasingMobiliario",
//     "leasingImobiliario",
//   ]),
//   term: z.number().min(1, "Prazo é obrigatório"),
//   includeInsurance: z.boolean(),
//   initialContribution: z.number().optional(),
// });

// export function SimulatorForm({ onSimulationComplete }) {
//   const t = useTranslations("SimulatorForm");
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       phoneNumber: "",
//       monthlyIncome: 0,
//       otherIncome: 0,
//       amount: 0,
//       productType: "creditoPessoal",
//       term: 12,
//       includeInsurance: false,
//       initialContribution: 0,
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     onSimulationComplete(values);
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="fullName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("fullName")}</FormLabel>
//               <FormControl>
//                 <Input placeholder={t("fullNamePlaceholder")} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("email")}</FormLabel>
//               <FormControl>
//                 <Input
//                   type="email"
//                   placeholder={t("emailPlaceholder")}
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="phoneNumber"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("phoneNumber")}</FormLabel>
//               <FormControl>
//                 <Input placeholder={t("phoneNumberPlaceholder")} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="monthlyIncome"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("monthlyIncome")}</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   {...field}
//                   onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="otherIncome"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("otherIncome")}</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   {...field}
//                   onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="amount"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("amount")}</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   {...field}
//                   onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="productType"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("productType")}</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder={t("selectProductType")} />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="creditoPessoal">
//                     {t("personalCredit")}
//                   </SelectItem>
//                   <SelectItem value="creditoHabitacao">
//                     {t("mortgageCredit")}
//                   </SelectItem>
//                   <SelectItem value="leasingMobiliario">
//                     {t("mobileLease")}
//                   </SelectItem>
//                   <SelectItem value="leasingImobiliario">
//                     {t("realEstateLease")}
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="term"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("term")}</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   {...field}
//                   onChange={(e) => field.onChange(parseInt(e.target.value))}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="includeInsurance"
//           render={({ field }) => (
//             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//               <div className="space-y-0.5">
//                 <FormLabel className="text-base">
//                   {t("includeInsurance")}
//                 </FormLabel>
//                 <FormDescription>
//                   {t("includeInsuranceDescription")}
//                 </FormDescription>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="initialContribution"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("initialContribution")}</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   {...field}
//                   onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">{t("simulate")}</Button>
//       </form>
//     </Form>
//   );
// }
