import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { ProjectHorizontalCard } from "@/components/ProjectCard";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { ProjectCardType } from "@/types/Projects";
import { IconCircleDashedPlus } from "@tabler/icons-react";

export default async function Page({ searchParams }: {
    searchParams: Promise<{ query?: string }>
}) {
    const query = (await searchParams).query
    const params = { search: query || null }
    const posts = await client.fetch(PROJECT_QUERY, params)
    return (
        <MaxWidthWrapper classname="py-3 divide-y flex flex-col gap-3">
            <section>
                <div className="flex justify-between">
                    <Search
                        query={query}
                        className="mx-0 max-w-xs"
                    />
                    <Button className="h-12">
                        <IconCircleDashedPlus size={16} />
                        Criar Projeto
                    </Button>
                </div>
            </section>
            <section className="pt-3">
                <h2 className="font-bold text-sm">
                    {query ? `Resultados de busca para "${query}"` : "Todos os Projetos"}
                </h2>
                <div>
                    <ul className="py-3 flex flex-col gap-1">
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