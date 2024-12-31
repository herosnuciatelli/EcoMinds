"use server"

import { createClient } from "@/utils/supabase/server"
import { parseServerActionResponse } from "@/lib/utils"
import slugify from "slugify"
import { writeClient } from "@/sanity/lib/write-client";

import { formSchema } from "@/types/Projects"
import { z } from "zod";
import { client } from "@/sanity/lib/client";
import { AUTHOR_QUERY } from "@/sanity/lib/queries";
import { getFilePath } from "@/utils/supabase/actions/storage";

type TCreatePitch = Omit<z.infer<typeof formSchema>, 'image' | 'projectFile'> & {
    image?: string
    project?: string
}

export const createPitch = async (form: TCreatePitch) => {
    const { auth } = await createClient()
    const { data } = await auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    const author_id = await client.fetch(AUTHOR_QUERY, { user_id: user.id })
    const { title, description, videoURL, pitch, image, project: projectFile } = form

    const slug = slugify(title as string, { lower: true, strict: true })

    try {
        if (!image) throw new Error('Image was not provided.')

        const imagePath = await getFilePath('images', image)
        const projectFilePath = await getFilePath('projects', projectFile)

        if (imagePath?.error) throw new Error('Error: Cannot get image path.')
        if (projectFilePath?.error) throw new Error('Error: Cannot get project path.')

        const project = {
            title,
            description,
            videoURL,
            slug: {
                _type: slug,
                current: slug
            },
            author: {
                _type: 'reference',
                _ref: author_id?._id
            },
            pitch,
            image: imagePath?.path,
            project: projectFilePath?.path,
            views: 1
        }

        const result = await writeClient.create({ _type: 'project', ...project })

        return parseServerActionResponse({ ...result, status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}

export const patchPitch = async (id: string, properties: TCreatePitch | null) => {
    const { auth } = await createClient()
    const { data } = await auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })
    if (!properties) return parseServerActionResponse({ error: 'None Property was provided.', status: 'ERROR' })

    const imagePath = await getFilePath('images', properties.image)
    const projectFilePath = await getFilePath('projects', properties.project)

    if (imagePath?.error) throw new Error('Error: Cannot get image path.')
    if (projectFilePath?.error) throw new Error('Error: Cannot get project path.')

    const filteredProperties = Object.fromEntries(
        Object.entries(properties).filter(([, value]) => value !== null)
    )

    try {
        const result = await writeClient.patch(id).set({
            ...filteredProperties
        }).commit()

        return parseServerActionResponse({ ...result, status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}

export const deletePitch = async (id: string) => {
    const { auth } = await createClient()
    const { data } = await auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    try {
        const result = await writeClient.delete(id)

        return parseServerActionResponse({ ...result, status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}