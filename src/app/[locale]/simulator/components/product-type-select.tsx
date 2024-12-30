
// // components/form/ProductTypeSelect.tsx
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Control } from "react-hook-form";
// import { PRODUCT_TYPES } from "../types";

// interface ProductTypeSelectProps {
//     control: Control<FormValues>;
// }

// export function ProductTypeSelect({ control }: ProductTypeSelectProps) {
//     return (
//         <FormField
//             control={control}
//             name="productType"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Tipo de Produto</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Selecione o tipo de produto" />
//                             </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                             {PRODUCT_TYPES.map(({ value, label }) => (
//                                 <SelectItem key={value} value={value}>
//                                     {label}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     );
// }