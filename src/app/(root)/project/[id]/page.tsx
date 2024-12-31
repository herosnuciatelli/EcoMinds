import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { client } from "@/sanity/lib/client"
import { PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries"
import { notFound } from "next/navigation"

import markdownit from 'markdown-it'
import { PROJECT_BY_ID_QUERYResult } from "@/sanity/types"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { View } from "@/components/View"
import { AnotherProjects } from "@/components/AnotherProjects"

const md = markdownit()


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const post: PROJECT_BY_ID_QUERYResult = await client.fetch(PROJECT_BY_ID_QUERY, { id })

    if (!post) return notFound()

    const parsedContent = md.render(post.pitch || '')


    return (
        <>
            <MaxWidthWrapper>
                <section className="h-96 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                    <div>
                        <div className="flex flex-col gap-1.5 items-center">
                            <h2 className="text-2xl lg:text-4xl text-white font-bold bg-stone-950 w-max p-3">{post.title}</h2>
                        </div>
                    </div>
                </section>
                <section>
                    <p className="text-justify text-stone-900">{post.description}</p>
                </section>
                <section className="py-10">
                    {post.image &&
                        <img
                            src={post.image}
                            width={100}
                            height={100}
                            alt="thumbnail"
                            className="w-full h-80 object-cover rounded-xl"
                        />
                    }

                    <div className="py-5">
                        <h3 className="text-xl font-semibold">Detalhes da Apresentação</h3>
                        {parsedContent ? (
                            <article
                                className="flex flex-col gap-1.5 py-3 text-justify prose break-all"
                                dangerouslySetInnerHTML={{ __html: parsedContent }}
                            />
                        ) : (
                            <p className="">Sem detalhes da apresentação</p>
                        )}
                    </div>
                    <hr className="border-stone-300" />
                    <div className="py-3">
                        <Suspense fallback={<Skeleton className="h-80 my-3" />}>
                            <AnotherProjects id={id} />
                        </Suspense>
                    </div>
                    <View id={id} views={post.views || 1} />
                </section>
            </MaxWidthWrapper>

        </>
    )
}