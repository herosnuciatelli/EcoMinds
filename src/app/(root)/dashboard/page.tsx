import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { ProjectHorizontalCard } from "@/components/ProjectCard";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { ProjectCardType } from "@/types/Projects";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import Link from "next/link";

export default async function Page({ searchParams }: {
    searchParams: Promise<{ query?: string }>
}) {
    const query = (await searchParams).query
    const params = { search: query || null }
    const posts = await client.fetch(PROJECT_QUERY, params)
    return (
        <MaxWidthWrapper classname="py-3 flex flex-col gap-3">
            <section className="h-32 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative bg-cover grid place-items-center">
                <div>
                    <div className="flex flex-col gap-1.5 items-center">
                        <h2 className="text-2xl lg:text-4xl text-white font-bold bg-stone-950 w-max p-3">
                            Gerenciar Projetos
                        </h2>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex flex-col gap-1.5 md:flex-row justify-between">
                    <Search
                        query={query}
                        className="mx-0 max-w-none w-full md:max-w-xs"
                        action="/dashboard/"
                    />
                    <Button className="h-12 w-max" asChild>
                        <Link href={'/dashboard/create'} className="flex items-center gap-1.5">
                            <IconCircleDashedPlus size={16} />
                            Criar Projeto
                        </Link>
                    </Button>
                </div>
            </section>
            <hr />
            <section>
                <h2 className="font-bold text-sm">
                    {query ? `Resultados de busca para "${query}"` : "Todos os Projetos"}
                </h2>
                <div>
                    <ul className="py-3 grid md:grid-cols-2 gap-1">
                        {posts.length > 0 ? posts.map((post: ProjectCardType) => (
                            <ProjectHorizontalCard
                                post={post}
                                key={post._id}
                            />
                        )) : (
                            <p className="font-semibold text-sm">Nenhum projeto encontrado.</p>
                        )}
                    </ul>
                </div>
            </section>
        </MaxWidthWrapper>

    )
}