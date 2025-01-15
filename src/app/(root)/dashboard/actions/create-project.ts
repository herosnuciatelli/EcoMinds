"use client"

import { toast } from "@/hooks/use-toast"
import { createPitch } from "@/lib/actions/pitch"
import { isValidPath, parseNameToStorage } from "@/lib/utils"
import { formSchema } from "@/types/Projects"
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import { ulid } from "ulid"
import { z } from "zod"

export const handleCreateProject = async ({projectData}: { projectData: z.infer<typeof formSchema>}) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    const { data: users } = await supabase.from('authors').select('*').eq('user_id', user.id)

    if (!users) return
    if (!users[0]) throw new Error('Nenhum usuário encontrado.')
    const {
        description,
        image,
        pitch,
        title,
        project,
        video
    } = projectData

    const standartUrl = 'https://exemplo.com'

    try {
        if (!image) throw new Error('Imagem não foi adicionada.')

        const newProject = {
            id: ulid(),
            description,
            pitch,
            title,
            video: video === standartUrl ? undefined : video,
            image: '',
            project: ''
        }

        const imageStorageName = `images/${newProject.id}/image`

        if (imageStorageName) {
            const { error } = await supabase.storage.from('projects').upload(imageStorageName, image)
            if (error) throw new Error(error.message)
            newProject.image = imageStorageName
        }

        const fileStorageName = `files/${newProject.id}/project`
        if (fileStorageName && project) {
            const { error } = await supabase.storage.from('projects').upload(fileStorageName, project)
            if (error) throw new Error(error.message)
            newProject.project = fileStorageName
        }

        const result = await createPitch(newProject)

        if (result.status === "SUCCESS") {
            toast({
                title: projectData.title,
                description: "O projeto foi criado com sucesso.",
                variant: 'success'
            })
        }

        setTimeout(() => {
            redirect(`/project/${result.id}`)
        }, 300)
    } catch (error) {
        const { message } = error as { message: string }

        toast({
            title: 'Erro: Erro ao armazenar os arquivos.',
            description: message,
            variant: 'destructive'
        })
    }
}
