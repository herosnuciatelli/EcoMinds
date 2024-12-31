"use client"

import { toast } from "@/hooks/use-toast"
import { createPitch } from "@/lib/actions/pitch"
import { parseNameToStorage } from "@/lib/utils"
import { formSchema } from "@/types/Projects"
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import { z } from "zod"

export const handleCreateProject = async (projectData: z.infer<typeof formSchema>) => {
    const supabase = createClient()
    const {
        description,
        image,
        pitch,
        title,
        projectFile,
        videoURL
    } = projectData

    try {

        const imageStorageName = parseNameToStorage(image.name)
        if (imageStorageName) {
            const { error } = await supabase.storage.from('images').upload(imageStorageName, image)
            if (error) throw new Error(error.message)
        }

        const fileStorageName = parseNameToStorage(projectFile?.name)
        if (fileStorageName && projectFile) {
            const { error } = await supabase.storage.from('projects').upload(fileStorageName, projectFile)
            if (error) throw new Error(error.message)
        }

        const result = await createPitch({
            description,
            image: imageStorageName,
            pitch,
            title,
            project: imageStorageName,
            videoURL
        })

        if (result.status = "SUCCESS") {
            toast({
                title: projectData.title,
                description: "O projeto foi criado com sucesso.",
                variant: 'success'
            })
        }

        setTimeout(() => {
            redirect(`/project/${result._id}`)
        }, 800)
    } catch (error) {
        const { message } = error as { message: string }

        toast({
            title: 'Erro: Erro ao armazenar os arquivos.',
            description: message,
            variant: 'destructive'
        })
    }
}
