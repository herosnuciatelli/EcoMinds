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
import { cn } from '@/lib/utils'
import { LoaderCircleIcon } from 'lucide-react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { ErrorWarning } from '@/components/ui/error-message'
import { ErrorsWarnings } from '@/utils/errors-warnings'

export const formSchema = z.object({
  email: z
    .string()
    .email(ErrorsWarnings.invalidFormat)
    .min(1, ErrorsWarnings.emptyField)
    .max(40, ErrorsWarnings.overCaractersField),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.'),
})

export const SignInForm = () => {
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
    password,
  }: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
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
          title: 'Login feito com sucesso!',
        })
        setTimeout(() => {
          router.push('/')
        }, 500)
      }
    })
  }

  return (
    <>
    <h2 className="text-center font-mono text-lg mb-3">Olá, Seja Bem-Vindo!</h2>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 rounded-md border p-4 dark:border-slate-800 dark:bg-slate-900"
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
          >
            <LoaderCircleIcon
              className={cn(
                {
                  hidden: !isPending,
                },
                'size-3 animate-spin',
              )}
            />
            Entrar
          </Button>
        </div>
      </form>
    </>
  )
}