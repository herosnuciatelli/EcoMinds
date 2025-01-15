'use client'

import { toast } from "@/hooks/use-toast";
import { patchPitch } from "@/lib/actions/pitch";
import { formSchema, ProjectType } from "@/types/Projects";
import { compareObjects } from "@/utils/objects/compare-objects";
import { isEmptyObject } from "@/utils/objects/empty-object";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { z } from "zod";

export const handleUpdateProject = async ({
    projectData,
    postData
}: {
    projectData: z.infer<typeof formSchema>
    postData?: ProjectType
}) => {
    try {
        if (!postData) throw new Error('Falta de informações.')
        const standartUrl = 'https://exemplo.com'

        if (projectData.video == standartUrl) {
            projectData.video = undefined
        }

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')
        const { data: users } = await supabase.from('authors').select('*').eq('user_id', user.id)

        if (!users) return
        if (!users[0]) throw new Error('Nenhum usuário encontrado.')

        const filledProperties = Object.fromEntries(
            Object.entries(projectData).filter(([, value]) => value !== undefined)
        )

        const updatedProperties = compareObjects(postData, filledProperties)

        const filteredNewValues = Object.fromEntries(
            Object.entries(updatedProperties).filter((value) => value[1]?.newValue !== undefined)
        )

        const { image, project } = filteredNewValues

        if (isEmptyObject(filteredNewValues)) throw new Error('Atualize alguma informação.', {
            cause: 'Nenhuma informação foi alterada!'
        })

        const imageStorageName = `images/${postData.id}/image`
        if (imageStorageName && image?.newValue.name) {
            if (postData.image) {
                const {error: uploadImageError} = await supabase.storage.from('projects').update(imageStorageName, image?.newValue, {
                    upsert: true,
                    cacheControl: '0'
                })
                if (uploadImageError) throw new Error(uploadImageError.message, { cause: uploadImageError.cause })
            }
        }

        const projectStorageName = `files/${postData.id}/project`
        if (projectStorageName && project?.newValue.name) {
            const {error} = await supabase.storage.from('projects').update(projectStorageName, project?.newValue, {
                upsert: true,
                cacheControl: '0'
            })
            if (error) throw new Error(error.message)
        }

        const newValues = Object.fromEntries(
            Object.entries(filteredNewValues).map(([key, value]) => [key, value?.newValue])
        )

        const sanityPatchValues = Object.fromEntries(
            Object.entries(newValues).filter(([key]) => key !== 'image' && key !== 'project')
        )

        const newProperties = {
            image: imageStorageName ? imageStorageName : undefined,
            project: projectStorageName ? projectStorageName : undefined,
            ...sanityPatchValues
        }

        const result = await patchPitch(postData.id, newProperties)

        if (result.status === "SUCCESS") {
            toast({
                title: projectData.title,
                description: "O projeto foi alterado com sucesso.",
                variant: 'success'
            })
        }

        setTimeout(() => {
            redirect(`/project/${result.id}`)
        }, 300)
    } catch (error) {
        const { message, cause } = error as { message: string, cause: string }

        toast({
            title: message,
            description: cause,
            variant: 'destructive'
        })
    }
}