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
    password: z.string().min(6, 'No minímo 6 caracteres.').max(50, ErrorsWarnings.overCaractersField)
})

export function ResetPasswordForm() {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ''
        }
    })

    const handleForm = async ({ password }: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.updateUser({
                password,
            })
            
            if (error) throw new Error(error.message, {
                cause: error.cause
            })

            toast({
                title: 'O email foi enviado com sucesso!.',
                variant: 'success'
            })
        } catch (error) {
            console.log(error)
            toast({
                title: 'Houve um erro em alterar a senha.',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForm)} className='py-5'>
                <div className='pb-9'>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Nova Senha</FormLabel>
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
                    <Button variant={'secondary'} size={'lg'} className='w-full' isLoading={isLoading} disabled={isLoading}>Alterar a Senha</Button>
                </div>
            </form>

        </Form>
    )
}