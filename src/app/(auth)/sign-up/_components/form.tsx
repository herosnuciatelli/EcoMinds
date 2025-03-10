'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { ErrorWarning } from '@/components/ui/error-message'
import { ErrorsWarnings } from '@/utils/errors-warnings'
import Link from 'next/link'

export const formSchema = z.object({
    email: z
        .string()
        .email(ErrorsWarnings.invalidFormat)
        .min(1, ErrorsWarnings.emptyField)
        .max(40, ErrorsWarnings.overCaractersField),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.'),
})

export const SignUpForm = () => {
    const router = useRouter()
    const [viewPass, setViewPass] = React.useState<boolean>(false)
    const [isPending, startTransition] = React.useTransition()

    const { toast } = useToast()

    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleSubmit = async ({
        email,
        password
    }: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                toast({
                    title: error.message,
                })

                const form = document.querySelector('#signInForm') as HTMLFormElement

                if (form) form.reset()
            } else {
                toast({
                    title: 'Conta criada com sucesso!',
                    description: 'Você já pode entrar na sua conta.',
                    variant: 'success'
                })
                setTimeout(() => {
                    router.push('/sign-in')
                }, 500)
            }

        })
    }

    return (
        <div className='grid place-items-center'>
            <div>
                <h2 className="text-center font-mono text-lg mb-3">Crie sua conta.</h2>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-5 rounded-md border p-4 shadow-xl shadow-violet-100"
                    id='signInForm'
                >
                    <div className="flex flex-col gap-1.5">
                        <div>
                            <label htmlFor="email" className='text-sm'>Email</label>
                            <Input {...form.register('email')} />

                            {form.formState.errors.email?.message &&
                                <ErrorWarning>
                                    <ErrorWarning.Title>{form.formState.errors.email.message}</ErrorWarning.Title>
                                </ErrorWarning>}
                        </div>
                        <div>
                            <label htmlFor="password" className='text-sm'>Senha</label>
                            <div className='relative flex items-center'>
                                <Input {...form.register('password')} type={viewPass ? 'text' : 'password'} />
                                {
                                    viewPass ?
                                        <IconEye
                                            onClick={() => setViewPass(!viewPass)}
                                            className="absolute right-3 size-4 cursor-pointer text-stone-400 transition-all hover:text-stone-300"
                                        />
                                        :
                                        <IconEyeOff
                                            onClick={() => setViewPass(!viewPass)}
                                            className="absolute right-3 size-4 cursor-pointer text-stone-400 transition-all hover:text-stone-300"
                                        />
                                }
                            </div>

                        </div>
                    </div>

                    <div>
                        <Button
                            className="flex w-full gap-1"
                            disabled={isPending}
                            isLoading={isPending}
                        >
                            Criar
                        </Button>
                    </div>
                </form>
                <h3 className='mt-5 text-center text-sm'>Já possui uma conta? <Link href={'/sign-up'} className='hover:underline text-violet-700 hover:text-violet-600'>Entrar na conta</Link></h3>
            </div>
        </div>
    )
}