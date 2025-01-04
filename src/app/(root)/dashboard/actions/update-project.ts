'use client'

import { toast } from "@/hooks/use-toast";
import { patchPitch } from "@/lib/actions/pitch";
import { getFileFullName, isValidPath, parseNameToStorage } from "@/lib/utils";
import { PROJECT_BY_ID_QUERYResult } from "@/sanity/types";
import { formSchema } from "@/types/Projects";
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
    postData?: PROJECT_BY_ID_QUERYResult
}) => {
    try {
        if (!postData) throw new Error('Falta de informações.')
        const standartUrl = 'https://exemplo.com'

        if (projectData.video == standartUrl) {
            projectData.video = undefined
        }

        const supabase = createClient()

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

        const imageStorageName = `images/${parseNameToStorage(image?.newValue.name)}`
        if (isValidPath(imageStorageName)) {
            if (postData.image) {
                const oldestImage = getFileFullName(postData.image)
                if (!oldestImage) throw new Error('Erro em coletar a imagem anterior')

                const { error: removeImageError } = await supabase.storage.from('projects').remove([`images/${oldestImage}`])
                if (removeImageError) throw new Error(removeImageError.message)

                const { error: uploadImageError } = await supabase.storage.from('projects').upload(imageStorageName, image?.newValue)
                if (uploadImageError) throw new Error(uploadImageError.message, { cause: uploadImageError.cause })
            }
        }

        const projectStorageName = `files/${parseNameToStorage(project?.newValue.name)}`
        if (isValidPath(projectStorageName)) {
            console.log(isValidPath(projectStorageName))
            if (postData.project) {
                const oldestProject = getFileFullName(postData.project)
                if (!oldestProject) throw new Error('Erro em coletar o projeto anterior')
                const { error } = await supabase.storage.from('projects').remove([`files/${oldestProject}`])
                if (error) throw new Error(error.message)
            }
            const { error } = await supabase.storage.from('projects').upload(projectStorageName, project?.newValue)
            if (error) throw new Error(error.message)
        }

        const newValues = Object.fromEntries(
            Object.entries(filteredNewValues).map(([key, value]) => [key, value?.newValue])
        )

        const sanityPatchValues = Object.fromEntries(
            Object.entries(newValues).filter(([key]) => key !== 'image' && key !== 'project')
        )

        const newProperties = {
            image: isValidPath(imageStorageName) ? imageStorageName : undefined,
            project: isValidPath(projectStorageName) ? projectStorageName : undefined,
            ...sanityPatchValues
        }

        const result = await patchPitch(postData._id, newProperties)

        if (result.status === "SUCCESS") {
            toast({
                title: projectData.title,
                description: "O projeto foi alterado com sucesso.",
                variant: 'success'
            })
        }

        setTimeout(() => {
            redirect(`/project/${result._id}`)
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