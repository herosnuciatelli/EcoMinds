import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { client } from "@/sanity/lib/client"
import { AUTHOR_QUERY, PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries"
import { notFound } from "next/navigation"

import markdownit from 'markdown-it'
import { PROJECT_BY_ID_QUERYResult } from "@/sanity/types"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { View } from "@/components/View"
import { AnotherProjects } from "@/components/AnotherProjects"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { IconFileTextSpark, IconMovie } from "@tabler/icons-react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

const md = markdownit()

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const post: PROJECT_BY_ID_QUERYResult = await client.fetch(PROJECT_BY_ID_QUERY, { id })

    if (!post) return notFound()

    const author = await client.fetch(AUTHOR_QUERY, { user_id: `${post.author?._ref}` })

    if (!author) return notFound()

    const parsedContent = md.render(post.pitch || '')

    return (
        <>
            <MaxWidthWrapper>
                <section className="h-96 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                    <div>
                        <div className="flex flex-col gap-1.5 items-center">
                            <h2 className="text-xl sm:text-2xl lg:text-4xl text-white font-bold bg-stone-950 max-w-sm md:max-w-lg text-center p-3">{post.title}</h2>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="my-5">
                        <Link href={`/author/${post.author?._ref}`} className="flex gap-1.5 group">
                            <Avatar className="group-hover:opacity-85 border border-stone-300 h-12 w-12">
                                <AvatarImage src={author.image ? author.image : '/user-profile.svg'} className={'object-contain'} />
                                <AvatarFallback>EM</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold">{author.name}</h3>
                                <span className="opacity-90">{'@' + author.username}</span>
                            </div>
                        </Link>
                    </div>
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
                        <h3 className="text-xl text-center font-semibold py-3">Detalhes da Apresentação</h3>
                        {parsedContent ? (
                            <article
                                className="flex flex-col gap-5 py-3 text-justify prose break-all"
                                dangerouslySetInnerHTML={{ __html: parsedContent }}
                            />
                        ) : (
                            <p className="">Sem detalhes da apresentação</p>
                        )}
                    </div>

                    <div className="flex gap-1.5 justify-center">
                        {post.video && (
                            <Link href={`${post.video}`} className={buttonVariants({ variant: 'outline' })} target="_blank">Assitir Video <IconMovie /></Link>
                        )}
                        {post.project && (
                            <Link href={`${post.project}`} className={buttonVariants({ variant: 'outline' })} target="_blank">Ver projeto <IconFileTextSpark /></Link>
                        )}
                    </div>
                </section>
                <hr className="border-stone-300" />
                <div className="py-3">
                    <section>
                        <Suspense fallback={<Skeleton className="h-80 my-3" />}>
                            <AnotherProjects id={id} />
                        </Suspense>
                    </section>
                </div>
                <View id={id} views={post.views || 1} />

            </MaxWidthWrapper>

        </>
    )
}