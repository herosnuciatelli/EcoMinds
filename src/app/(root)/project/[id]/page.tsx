import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { notFound } from "next/navigation"

import markdownit from 'markdown-it'
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AnotherProjects } from "@/components/AnotherProjects"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { IconFileTextSpark, IconMovie } from "@tabler/icons-react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { createClient } from "@/utils/supabase/server"

const md = markdownit()

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    
    const supabase = await createClient()

    const { data: post } = await supabase.from('projects').select('*').eq('id', id)

    if (!post) return
    if (post?.length < 1) return notFound()

    const { data: author } = await supabase.from('authors').select('*').eq('id', post[0].author)

    if (!author) return notFound()

    const parsedContent = md.render(post[0].pitch || '')

    const timestamp = new Date().getTime()

    return (
        <>
            <MaxWidthWrapper>
                <section className="h-96 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                    <div>
                        <div className="flex flex-col gap-1.5 items-center">
                            <h2 className="text-xl sm:text-2xl lg:text-4xl text-white font-bold bg-stone-950 max-w-sm md:max-w-lg text-center p-3">{post[0].title}</h2>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="my-5">
                        <Link href={`/author/${post[0].author}`} className="flex items-center gap-1.5 group w-max">
                            <Avatar className="group-hover:opacity-85 border border-stone-300 h-12 w-12">
                                <AvatarImage src={author[0].image ? `${author[0].image}?nocache=${timestamp}` : '/user-profile.svg'} className={'object-cover'} />
                                <AvatarFallback>EM</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold">{author[0].name}</h3>
                            </div>
                        </Link>
                    </div>
                    <p className="text-justify text-stone-900">{post[0].description}</p>
                </section>
                <section className="py-10">
                    {post[0].image &&
                        <img
                            src={post[0].image + `?nocache=${timestamp}`}
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
                        {post[0].video && (
                            <Link href={`${post[0].video}`} className={buttonVariants({ variant: 'outline' })} target="_blank">Assitir Video <IconMovie /></Link>
                        )}
                        {post[0].project && (
                            <Link href={`${post[0].project}`} className={buttonVariants({ variant: 'outline' })} target="_blank">Ver projeto <IconFileTextSpark /></Link>
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
            </MaxWidthWrapper>

        </>
    )
}