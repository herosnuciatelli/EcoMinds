'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconAlertCircle, IconCircleDashedCheck, IconEdit, IconLockSquareRounded, IconSettings } from "@tabler/icons-react"
import { z } from "zod"
import { ErrorsWarnings } from "@/utils/errors-warnings"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from "react"
import { Input } from "./input"
import { handleUpdateAuthor } from "@/app/(root)/author/[id]/actions/update-profile"


export const editProfileFormSchema = z.object({
    avatar: z.any()
        .refine((file) => {
            const MAX_UPLOAD_SIZE = 1024 * 1024 * 5
            return !file || file.size <= MAX_UPLOAD_SIZE
        }, 'O arquivo deve ter menos de 5MB')
        .refine((file) => {
            if (!file?.name) return false
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
            return allowedMimeTypes.includes(file?.type)
        }, 'A extensão não é válida. Aceitamos apenas .png, .jpg')
        .optional(),
    name: z.string().min(1, ErrorsWarnings.emptyField).max(50, ErrorsWarnings.overCaractersField).optional()
})

export function EditProfileDialog({ avatar, name, email }: { avatar?: string, name: string, email: string }) {
    const timestamp = new Date().getTime();
    const [avatarSrc, setAvatarSrc] = useState(avatar + `?nocache=${timestamp}`)
    const [isLoading, setIsLoading] = useState(false)
    const [canSaveChanges, setCanSaveChanges] = useState({
        avatar: false,
        name: false
    })

    const form = useForm<z.infer<typeof editProfileFormSchema>>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: {
            name
        }
    })

    const handleEditProfile = async (data: z.infer<typeof editProfileFormSchema>) => {
        setIsLoading(true)
        try {
            if (data.name === name) {
                data.name = undefined
            }

            await handleUpdateAuthor({ data })

            setTimeout(() => window.location.reload(), 300)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <Dialog>
                <DialogTrigger asChild>
                    <li className={cn(buttonVariants({ variant: 'ghost' }), "rounded-none cursor-pointer py-1.5")}><IconSettings />Editar Perfil</li>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                        <DialogDescription>
                            Você pode salvar as alterarações do seu perfil. Ao clicar no botão Salvar.
                        </DialogDescription>
                    </DialogHeader>
                    <hr />
                    <div className={'bg-yellow-100 border border-b-2 border-r-2 px-1.5 py-1 border-yellow-500 rounded'}>
                        <span className="flex gap-1.5 items-center text-xs font-bold"><IconAlertCircle className="text-yellow-900" />Atenção: Ao atualizar o avatar é normal haver um período para mostrar a mudança</span>
                    </div>
                    <form onSubmit={form.handleSubmit(handleEditProfile)}>
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => {
                                const handleFileInputChange = (
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const files = event.target.files
                                    if (files) {
                                        form.setValue('avatar', files[0])
                                        const url = URL.createObjectURL(files[0])
                                        setAvatarSrc(url)
                                        console.log(url)
                                        setCanSaveChanges({ ...canSaveChanges, avatar: true })
                                    }
                                }
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative mx-auto w-max">
                                                <img src={avatarSrc ? avatarSrc : '/user-profile.svg'} className="w-32 h-32 rounded-full border-2 border-violet-800" />
                                                <Button
                                                    size={'icon'}
                                                    variant={'outline'}
                                                    className="absolute bottom-0 right-0 p-0"
                                                    onClick={() => document.getElementById('avatar')?.click()}
                                                    type="button"
                                                ><IconEdit /></Button>

                                                <input id="avatar" type="file" className="hidden" onChange={handleFileInputChange} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                const handleInputChange = (
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const newName = event.target.value

                                    if (newName !== name) {
                                        setCanSaveChanges({ ...canSaveChanges, name: true })
                                    } else {
                                        setCanSaveChanges({ ...canSaveChanges, name: false })
                                    }
                                    form.setValue('name', newName)
                                }
                                return (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input onChange={handleInputChange} defaultValue={name} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <hr className="my-3" />
                        <div className="py-1.5 flex flex-col gap-2">
                            <FormLabel>Email</FormLabel>
                            <Input value={email} disabled />
                        </div>
                        <div className="flex justify-between pt-5">
                            <Button size='sm' variant={'ghost'} type="button"><IconLockSquareRounded />Mudar Senha</Button>
                            <Button size='sm' variant={'secondary'} isLoading={isLoading} disabled={!(canSaveChanges.avatar || canSaveChanges.name) || isLoading}><IconCircleDashedCheck />Salvar</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Form>

    )
}