'use client'

import { editProfileFormSchema } from "@/components/ui/edit-profile-dialog";
import { toast } from "@/hooks/use-toast";
import { updateAuthor } from "@/lib/actions/author";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";

export async function handleUpdateAuthor({data}:{ data: z.infer<typeof editProfileFormSchema>}) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')
        const { data: users } = await supabase.from('authors').select('*').eq('user_id', user.id)

        if (!users) return
        if (!users[0]) throw new Error('Nenhum usuário encontrado.')
            
        const avatarStoragePath = `${users[0].id}/avatar`
        if (data.avatar) {
            const {error} = await supabase.storage.from('avatars').update(avatarStoragePath, data.avatar, {
                cacheControl: '0',
                upsert: true
            })
            if (error ) throw new Error('Erro ao atualizar avatar.')
        }

        const updateValues = {
            avatar: avatarStoragePath ? avatarStoragePath : null,
            name: data.name
        }

        const result = await updateAuthor(updateValues)

        if (result.status === "SUCCESS") {
            toast({
                description: "O perfil foi atualizado com sucesso.",
                variant: 'success'
            })
        }

    } catch (error) {
        const { message } = error as { message: string }

        toast({
            title: 'Erro: Erro ao atualizar o perfil.',
            description: message,
            variant: 'destructive'
        })
    }
}