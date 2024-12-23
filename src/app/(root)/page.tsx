import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { ProjectCard } from "@/components/ProjectCard";
import { Search } from "@/components/search/Search";
import { Slides } from "@/components/Slider";
import { client } from "@/sanity/lib/client";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { ProjectCardType } from "@/types/Projects";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ query?: string }>
}) {
  const query = (await searchParams).query
  const params = { search: query || null }
  const posts = await client.fetch(PROJECT_QUERY, params)

  return (
    <div>
      <MaxWidthWrapper>
        <section className="py-5">
          <Slides />
        </section>
        <section className="py-3">
          <Search query={query} />
        </section>
        <section className="py-2">
          <h2 className="font-bold text-xl">
            {query ? `Resultados de busca para "${query}"`: "Todos os Projetos"}
          </h2>
          <ul className="py-3 grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-3">
            {posts.length > 0 ? (
              posts.map((post: ProjectCardType, index: number) => (
                <ProjectCard 
                  post={post}
                  key={index}
                />
              ))
            ): (
              <p className="font-semibold text-sm">Nenhum projeto encontrado.</p>
            )}
          </ul>
        </section>
      </MaxWidthWrapper>
    </div>
  );
}

