'use client'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { ErrorsWarnings } from '@/utils/errors-warnings'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const formSchema = z.object({
    email: z.string().min(1, ErrorsWarnings.emptyField).max(100, ErrorsWarnings.overCaractersField).email(ErrorsWarnings.invalidFormat)
})

export function ForgetPasswordForm() {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })

    const handleForm = async ({ email }: z.infer<typeof formSchema>) => {
        const hasUrl = `https://${process.env.URL}`
        const url = `${process.env.URL ? hasUrl : 'http://localhost:3000'}/dashboard/settings` // change it later

        setIsLoading(true)

        try {
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: url,
            })
        } catch (error) {
            return // Para medidas de segurança não vou dar feedback para o usuário
        } finally {
            setIsLoading(false)
        }


        toast({
            title: 'O email foi enviado com sucesso!.',
            variant: 'success'
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForm)} className='py-5'>
                <div className='pb-9'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </div>


                <hr />

                <div className='pt-5'>
                    <Button variant={'secondary'} size={'lg'} className='w-full' isLoading={isLoading} disabled={isLoading}>Enviar Email</Button>
                </div>
            </form>

        </Form>
    )
}