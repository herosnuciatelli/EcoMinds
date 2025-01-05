'use client'

import { IconSend } from "@tabler/icons-react";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { ErrorsWarnings } from "@/utils/errors-warnings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { createAuthor } from "@/lib/actions/author";
import { ErrorWarning } from "./ui/error-message";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, ErrorsWarnings.emptyField).max(50, ErrorsWarnings.overCaractersField)
})

export function FillProfileForm({ id }: { id: string }) {
    const [isLoading, startTransition] = useTransition()

    const { register, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const handleFillUpProfile = async (form: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            const result = await createAuthor({
                id,
                name: form.name
            })

            if (result.status === 'SUCCESS') {
                toast({
                    title: 'Você conseguiu!',
                    description: 'Sua conta foi criada com sucesso!',
                    variant: 'success'
                })
                
                setTimeout(() => window.location.reload(), 300)
            } else {
                toast({
                    title: result.error,
                    variant: 'destructive'
                })
            }
        })
    }
    return (
        <MaxWidthWrapper classname="grid place-items-center">
            <div className="my-40">
                <form onSubmit={handleSubmit(handleFillUpProfile)} className="flex flex-col items-center">
                    <div className="flex flex-col gap-1.5 border border-dashed p-5 rounded border-stone-400">
                        <h2 className="text-lg font-semibold text-center mb-5">Estamos quase lá...</h2>
                        <div>
                            <Input id="name" placeholder="Seu nome..." className="text-lg p-3" {...register('name')} />
                            {formState.errors.name && (
                                <ErrorWarning>
                                    <ErrorWarning.Title>{formState.errors.name.message}</ErrorWarning.Title>
                                </ErrorWarning>
                            )}
                        </div>
                    </div>

                    <Button type="submit" size={'sm'} className="w-max mt-5 group" isLoading={isLoading}>Enviar <IconSend className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" /></Button>
                </form>
            </div>
        </MaxWidthWrapper>
    )
}