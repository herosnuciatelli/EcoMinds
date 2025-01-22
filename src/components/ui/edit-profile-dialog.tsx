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
import { useRef, useState } from "react"
import { Input } from "./input"
import { handleUpdateAuthor } from "@/app/(root)/author/[id]/actions/update-profile"
import Link from "next/link"
import { usePathname } from "next/navigation"


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
    name: z.string().min(1, ErrorsWarnings.emptyField).max(50, ErrorsWarnings.overCaractersField).optional(),
    password: z.string().min(6, 'No mínimo 6 caracteres.').max(50, ErrorsWarnings.overCaractersField).optional()
})

export function EditProfileDialog({ userProfile, params }: {
    userProfile: {
        avatar: any
        name: any
        email: string | undefined
    }
    params: string | undefined
}) {
    const { avatar, name, email } = userProfile || {
        avatar: null,
        name: null,
        email: null
    }
    if (!params) {
        params = 'profile'
    }

    const timestamp = new Date().getTime();
    const [avatarSrc, setAvatarSrc] = useState(avatar + `?nocache=${timestamp}`)
    const [isLoading, setIsLoading] = useState(false)
    const [canSaveChanges, setCanSaveChanges] = useState({
        avatar: false,
        name: false,
        password: false
    })
    const [canChangePassword, setCanChangePassword] = useState(false)

    const pathname = usePathname()

    const form = useForm<z.infer<typeof editProfileFormSchema>>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: {
            name,
            password: '*******'
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
                <DialogContent className="max-w-2xl md:flex py-0 min-h-[550px]">
                    <aside className="md:border-r">
                        <nav className="w-full">
                            <h3 className="font-bold py-3 pr-6">Configurações</h3>
                            <ul className="py-3 w-full flex flex-col gap-1.5">
                                <li className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'md:rounded-r-none hover:bg-stone-100', {
                                    'bg-stone-200 hover:bg-stone-200': params === 'profile'
                                })}>
                                    <Link href={pathname + '?settings=profile'} className="w-full text-sm">
                                        Perfil
                                    </Link>
                                </li>
                                <li className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'md:rounded-r-none hover:bg-stone-100', {
                                    'bg-stone-200 hover:bg-stone-200': params === 'account'
                                })}>
                                    <Link href={pathname + '?settings=account'} className="w-full text-sm">
                                        Conta
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    {params === 'profile' && (
                        <div className="flex flex-col gap-3 px-3 py-5">
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
                                    render={() => {
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
                                    render={() => {
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
                                <div className="flex justify-between pt-5">
                                    <Button size='sm' variant={'secondary'} isLoading={isLoading} disabled={!(canSaveChanges.avatar || canSaveChanges.name) || isLoading}><IconCircleDashedCheck />Salvar</Button>
                                </div>
                            </form>
                        </div>
                    )}
                    {params === 'account' && (
                        <div className="px-3 py-5">
                            <DialogHeader>
                                <DialogTitle>Informações de conta</DialogTitle>
                                <DialogDescription>
                                    Você pode ver as informações da sua conta e alterá-las.
                                </DialogDescription>
                                <div className="py-3 flex flex-col gap-1.5">
                                    <div className="py-1.5 flex flex-col gap-2">
                                        <FormLabel>Email</FormLabel>
                                        <Input value={email} disabled />
                                    </div>
                                    <hr />
                                    <div>
                                        <h3 className="font-semibold text-sm py-3">Deseja Alterar a Senha?</h3>
                                        <Link href={'/reset-password'}>
                                            <Button size='sm' variant={'ghost'} className="w-max" type="button"><IconLockSquareRounded />Mudar Senha</Button>
                                        </Link>

                                    </div>

                                </div>
                            </DialogHeader>
                        </div>
                    )}

                </DialogContent>
            </Dialog>
        </Form>

    )
}