import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Page() {
    const { auth } = await createClient()
    const { data } = await auth.getUser()

    if (!data.user) {
        redirect('/')
    }
    return (
        <div>
            <h2>Resetar sua senha</h2>
        </div>
    )
}