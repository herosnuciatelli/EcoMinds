import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { ProjectForm } from "@/components/ProjectForm"
import { notFound } from "next/navigation"
import { handleUpdateProject } from "@/app/(root)/dashboard/actions/update-project"
import { IconPencilCheck } from "@tabler/icons-react"
import { createClient } from "@/utils/supabase/server"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const supabase = await createClient()

    const { data: post } = await supabase.from('projects').select('*').eq('id', id)

    if (!post) return notFound()
    return (
        <>
            <MaxWidthWrapper>
                <section className="h-96 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                    <div>
                        <div className="flex flex-col gap-1.5 items-center">
                            <h2 className="text-2xl lg:text-4xl text-white font-bold bg-stone-950 w-max p-3">
                                Atualize seu Projeto
                            </h2>
                        </div>
                    </div>
                </section>
                <div data-color-mode="light">
                    <ProjectForm action={handleUpdateProject} post={post[0]}>
                        Salvar <IconPencilCheck />
                    </ProjectForm>
                </div>
            </MaxWidthWrapper>
        </>
    )
}