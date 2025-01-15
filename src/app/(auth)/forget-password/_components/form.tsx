'use client'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ErrorsWarnings } from '@/utils/errors-warnings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const formSchema = z.object({
    email: z.string().min(1, ErrorsWarnings.emptyField).max(100, ErrorsWarnings.overCaractersField).email(ErrorsWarnings.invalidFormat)
})

export function ForgetPasswordForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })

    const handleForm = (data: z.infer<typeof formSchema>) => {
        console.log(data)
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
                                    <FormLabel>Nome</FormLabel>
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
                    <Button variant={'secondary'} size={'lg'} className='w-full'>Enviar Email</Button>
                </div>
            </form>

        </Form>
    )
}