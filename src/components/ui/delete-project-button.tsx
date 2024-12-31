'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "./button"
import { IconTrashX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { deletePitch } from "@/lib/actions/pitch"


export function DeleteProjectButton({ id }: { id: string}) {

    const handleDeleteProject = async () => {
        try {
            const result = await deletePitch(id)

            if (result.status === 'SUCCESS') {
                toast({
                    title: "Projeto apagado com sucesso.",
                    variant: 'success'
                })
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Erro ao tentar apagar projeto.",
                variant: 'destructive'
            })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className={cn(buttonVariants({ variant: 'destructive' }), "w-full justify-between")}>
                Deletar
                <IconTrashX />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem absoluta certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso vai permanentemente apagar este projeto
                        e remover seus dados de nossos servidores.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProject}>Apagar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}