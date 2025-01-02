import { createClient } from '@/utils/supabase/server'

export async function getFilePath(bucket: string, fileInternPath?: string) {
    const supabase = await createClient()

    try {
        if (!fileInternPath) return null

        const { data } = supabase.storage.from(bucket).getPublicUrl(fileInternPath)
        const path = data.publicUrl

        if (!path) throw new Error('Invalid path.')

        return { path }
    } catch (error) {
        return { error }
    }

}