import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { StandartsProjects } from "@/components/Projects";
import { Search } from "@/components/search/Search";
import { Slides } from "@/components/Slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ query?: string }>
}) {
  const query = (await searchParams).query
  const params = { search: query || null }

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
            {query ? `Resultados de busca para "${query}"` : "Todos os Projetos"}
          </h2>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <StandartsProjects variant="vertical" params={params} />
          </Suspense>
        </section>
      </MaxWidthWrapper>
    </div>
  );
}

