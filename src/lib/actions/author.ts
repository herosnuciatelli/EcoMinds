'use server'

import { createClient } from "@/utils/supabase/server"
import { parseServerActionResponse } from "../utils"
import { writeClient } from "@/sanity/lib/write-client"
import { ulid } from "ulid"
import slugify from "slugify"

type createAuthor = {
    id: string
    name: string
}

export const createAuthor = async (form: createAuthor) => {
    const { auth } = await createClient()
    const { data } = await auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    try {
        const username = slugify(form.name as string, { strict: true})
        const author = {
            id: ulid(),
            name: form.name,
            user_id: form.id,
            username
        }
        const result = await writeClient.create({ _type: 'author', ...author})
        return parseServerActionResponse({ ...result, status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}