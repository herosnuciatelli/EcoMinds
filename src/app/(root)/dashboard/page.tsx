import { FillProfileForm } from "@/components/fill-profile-form";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { StandartsProjects } from "@/components/Projects";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ searchParams }: {
    searchParams: Promise<{ query?: string }>
}) {
    const query = (await searchParams).query
    const params = { search: query || null }

    const supabase = await createClient()

    const auth_id = (await supabase.auth.getUser()).data.user?.id

    if (!auth_id) return notFound()

    const { data: authors } = await supabase.from('authors').select('*').eq('user_id', auth_id)

    if (authors?.length === 0) return <FillProfileForm id={auth_id} />

    return (
        <MaxWidthWrapper classname="py-3 flex flex-col gap-3">
            <section className="h-32 bg-[url('/project-banner.svg')] rounded-2xl bg-no-repeat w-full my-5 relative grid place-items-center">
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
                    <Link href={'/dashboard/create'} >
                        <Button className="h-12 w-max flex items-center gap-1.5">
                            <IconCircleDashedPlus size={16} />
                            Criar Projeto
                        </Button>
                    </Link>
                </div>
            </section>
            <hr />
            <section>
                <h2 className="font-bold text-sm">
                    {query ? `Resultados de busca para "${query}"` : "Todos os Projetos"}
                </h2>
                <div>
                    <StandartsProjects variant="horizontal" params={params} id={authors && authors[0].id} />
                </div>
            </section>
        </MaxWidthWrapper>
    )
}