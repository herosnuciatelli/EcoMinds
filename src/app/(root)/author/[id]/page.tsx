import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { StandartsProjects } from "@/components/Projects"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { client } from "@/sanity/lib/client"
import { AUTHOR_QUERY } from "@/sanity/lib/queries"
import { AUTHOR_QUERYResult } from "@/sanity/types"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const author: AUTHOR_QUERYResult = await client.fetch(AUTHOR_QUERY, { user_id: `${id}` })

    if (!author) return notFound()

    return (
        <MaxWidthWrapper>
            <section className="py-1.5">
                <div className="bg-[url('/project-banner.svg')] py-9 px-6 rounded flex gap-12 items-center">
                    <img src={author.image ? author.image : '/user-profile.svg'} className="w-32 rounded-full border-2 border-violet-800" />

                    <div>
                        <h2 className="text-white font-bold text-xl lg:text-2xl">{author.name}</h2>
                        <span className="text-white font-extrabold opacity-80">{'@' + author.username}</span>

                        <h3 className="font-semibold mt-5 text-white text-sm bg-violet-800/40 border-2 border-violet-800 px-2 py-1.5 rounded-sm w-max">Autor</h3>
                    </div>
                </div>
            </section>

            <nav className="py-3">
                <ul>
                    <li className={cn(buttonVariants({ variant: 'ghost' }), "rounded-none cursor-pointer border-b-2 border-stone-800 py-1.5")}>Projetos</li>
                </ul>
            </nav>

            <section>
                <StandartsProjects params={{ search: null }} variant="vertical" id={author._id} />
            </section>
        </MaxWidthWrapper>
    )
}