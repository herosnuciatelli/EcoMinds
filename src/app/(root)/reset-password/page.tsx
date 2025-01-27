import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "./_components/form"

export default async function Page() {
    const { auth } = await createClient()
    const { data } = await auth.getUser()

    if (!data.user) {
        redirect('/')
    }
    return (
        <div className="py-24 grid place-items-center">
            <div className="max-w-md">
                <h2 className="font-bold text-3xl">Resetar Sua Senha</h2>
                <p className="py-1 text-sm">Insira a sua nova senha.</p>
                <ResetPasswordForm />
            </div>
        </div>
    )
}

/*
const { data, error } = await supabase.auth.updateUser({
  password: new_password
})
*/