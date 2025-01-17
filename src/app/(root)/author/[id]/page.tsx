import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { StandartsProjects } from "@/components/Projects"
import { buttonVariants } from "@/components/ui/button"
import { EditProfileDialog } from "@/components/ui/edit-profile-dialog"

import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

export default async function Page({ params, searchParams }: { 
    params: Promise<{ id: string }>
    searchParams: Promise<{ settings?: string }>
}) {
    const id = (await params).id
    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user
    const { data: author } = await supabase.from('authors').select('*').eq('id', id)
    if (!author) return notFound()
    const timestamp = new Date().getTime();
    const query = (await searchParams).settings

    const profile = {
        avatar: author[0].image,
        name: author[0].name,
        email: user?.email
    }

    return (
        <MaxWidthWrapper>
            <section className="py-1.5">
                <div className="bg-[url('/project-banner.svg')] py-9 px-6 rounded flex gap-12 items-center">
                    <img src={author[0].image ? `${author[0].image}?nocache=${timestamp}` : '/user-profile.svg'} className="w-32 h-32 rounded-full border-2 border-violet-800" />

                    <div>
                        <h2 className="text-white font-bold text-xl lg:text-2xl">{author[0].name}</h2>
                        <h3 className="font-semibold mt-5 text-white text-sm bg-violet-800/40 border-2 border-violet-800 px-2 py-1.5 rounded-sm w-max">Autor</h3>
                    </div>
                </div>
            </section>

            <nav className="py-3">
                <ul className="flex gap-1.5">
                    <li className={cn(buttonVariants({ variant: 'ghost' }), "rounded-none cursor-pointer border-b-2 border-stone-800 py-1.5")}>Projetos</li>
                    {user?.id === author[0].user_id && (
                        <EditProfileDialog userProfile={profile} params={query}  />
                    )}
                </ul>
            </nav>

            {/* <section>
                <StandartsProjects params={{ search: null }} variant="vertical" id={author[0].id} />
            </section> */}
        </MaxWidthWrapper>
    )
}