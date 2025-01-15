'use server'

import { createClient } from "@/utils/supabase/server"
import { parseServerActionResponse } from "../utils"
import { ulid } from "ulid"
import slugify from "slugify"
import { z } from "zod"
import { editProfileFormSchema } from "@/components/ui/edit-profile-dialog"

type createAuthor = {
    id: string
    name: string
}

export const createAuthor = async (form: createAuthor) => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    try {
        const author = {
            id: ulid(),
            name: form.name,
            user_id: form.id,
            image: ''
        }

        author.image = `https://mzauvmnzsfoocafrhuhf.supabase.co/storage/v1/object/public/avatars/${author.id}/avatar`

        const { data: result, error } = await supabase
            .from('authors')
            .insert([
                author,
            ])
            .select()

        return parseServerActionResponse({ ...result, status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
}

export const updateAuthor = async (form: z.infer<typeof editProfileFormSchema>) => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    try {
        if (form.name) {
            const { error } = await supabase.from('authors').update({ name: form.name }).eq('user_id', user.id)
            if (error) throw new Error(error.message)
        }
        return parseServerActionResponse({ status: 'SUCCESS' })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: "Error" })
    }
    
}