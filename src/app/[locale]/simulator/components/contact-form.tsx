'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { formContactSchema, SimulationFormData } from '../types'
import { z } from 'zod'

interface ContactFormProps {
    initialData: SimulationFormData
    onSubmit: (data: z.infer<typeof formContactSchema>) => void
}

export function ContactForm({ initialData, onSubmit }: ContactFormProps) {
    const t = useTranslations('SubmitToBankForm')
    const form = useForm<z.infer<typeof formContactSchema>>({
        resolver: zodResolver(formContactSchema),
        defaultValues: {
            fullName: initialData.fullName,
            phone: initialData.phoneNumber,
            email: initialData.email,
            consent: false,
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('name')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('phone')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('email')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    {t('acceptTerms')}
                                </FormLabel>
                                <FormDescription>
                                    {t('termsDescription')}
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">{t('submit')}</Button>
            </form>
        </Form>
    )
}

