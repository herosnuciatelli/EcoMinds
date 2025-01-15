"use server"

import { createClient } from "@/utils/supabase/server"
import { parseServerActionResponse } from "@/lib/utils"
import { formSchema } from "@/types/Projects"
import { z } from "zod";
import { getFilePath } from "@/utils/supabase/actions/storage";
import { ulid } from "ulid";

type TCreatePitch = Omit<z.infer<typeof formSchema>, 'image' | 'project'> & {
    id: string
    image?: string
    project?: string
}

export type TNewProperties = {
    [k: string]: string | undefined
}


export const createPitch = async (form: TCreatePitch) => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    const { data:authors} = await supabase.from('authors').select('*').eq('user_id', user.id)
    if (!authors) throw new Error('Autor não encontrado!')
    const { title, description, video, pitch, image, project: projectFile } = form

    try {
        if (!image) throw new Error('Image was not provided.')
        const imagePath = await getFilePath('projects', image)
        const projectFilePath = await getFilePath('projects', projectFile)

        if (imagePath?.error) throw new Error('Error: Cannot get image path.')
        if (projectFilePath?.error) throw new Error('Error: Cannot get project path.')

        const project = {
            id: form.id,
            title,
            description,
            video,
            author: authors[0].id,
            pitch,
            image: imagePath?.path,
            project: projectFilePath?.path,
        }

        const { data, error } = await supabase.from('projects').insert([project]).select()
        if (error) throw new Error(error.message)
        return parseServerActionResponse({ ...data[0], status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}

export const patchPitch = async (id: string, properties: TNewProperties) => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })
    if (!properties) return parseServerActionResponse({ error: 'None Property was provided.', status: 'ERROR' })

    try {
        const values = {
            ...properties
        }

        const imagePath = await getFilePath('projects', properties.image)
        values.image = imagePath?.path

        const projectFilePath = await getFilePath('projects', properties.project)
        values.project = projectFilePath?.path

        if (imagePath?.error) throw new Error('Error: Cannot get image path.')
        if (projectFilePath?.error) throw new Error('Error: Cannot get project path.')
        
        const filteredValues = Object.fromEntries(
            Object.entries(values).filter(([, value]) => value !== null && value !== undefined)
        )

        const { data: updatedProject, error} = await supabase.from('projects').update({
            ...filteredValues
        }).eq('id', id).select()

        if (error) throw new Error(error.message)

        return parseServerActionResponse({ ...updatedProject[0], status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}

export const deletePitch = async (id: string) => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    try {
        const result = await supabase.from('projects').delete().eq('id', id)

        return parseServerActionResponse({ ...result, status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}