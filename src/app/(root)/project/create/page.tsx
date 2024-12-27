import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { ProjectForm } from "@/components/ProjectForm"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Page() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    if (!user) redirect('/')

    return (
        <>
            <section className="h-96 bg-[url('/project-banner.svg')] bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                <div>
                    <div className="flex flex-col gap-1.5 items-center">
                        <h2 className="text-2xl lg:text-4xl text-white font-bold bg-stone-950 w-max p-3">
                            Envie seu novo projeto
                        </h2>
                    </div>
                </div>    
            </section>
            <MaxWidthWrapper>
                <div data-color-mode="light">
                    <ProjectForm />
                </div>
            </MaxWidthWrapper>
        </>
    )
}