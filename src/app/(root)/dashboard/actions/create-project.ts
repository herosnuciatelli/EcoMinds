"use client"

import { toast } from "@/hooks/use-toast"
import { createPitch } from "@/lib/actions/pitch"
import { isValidPath, parseNameToStorage } from "@/lib/utils"
import { formSchema } from "@/types/Projects"
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import { z } from "zod"

export const handleCreateProject = async ({projectData}: { projectData: z.infer<typeof formSchema>}) => {
    const supabase = createClient()
    const {
        description,
        image,
        pitch,
        title,
        project,
        video
    } = projectData

    console.log()

    try {
        if (!image) throw new Error('Imagem não foi adicionada.')

        const sanityCreateValues = {
            description,
            pitch,
            title,
            video,
            image: '',
            project: ''
        }

        const imageStorageName = `images/${parseNameToStorage(image.name)}`

        if (isValidPath(imageStorageName)) {
            const { error } = await supabase.storage.from('projects').upload(imageStorageName, image)
            if (error) throw new Error(error.message)
            sanityCreateValues.image = imageStorageName
        }

        const fileStorageName = `files/${parseNameToStorage(project?.name)}`
        if (isValidPath(fileStorageName) && project) {
            const { error } = await supabase.storage.from('projects').upload(fileStorageName, project)
            if (error) throw new Error(error.message)
            sanityCreateValues.project = fileStorageName
        }

        const result = await createPitch(sanityCreateValues)

        if (result.status === "SUCCESS") {
            toast({
                title: projectData.title,
                description: "O projeto foi criado com sucesso.",
                variant: 'success'
            })
        }

        setTimeout(() => {
            redirect(`/project/${result._id}`)
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
