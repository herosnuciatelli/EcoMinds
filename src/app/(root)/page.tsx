import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { StandartsProjects } from "@/components/Projects";
import { Search } from "@/components/search/Search";
import { Slides } from "@/components/Slider";
import { Button } from "@/components/ui/button";
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
      <div className="relative flex justify-center -z-10 select-none">
          <div className="absolute h-full w-full max-w-6xl border-x border-stone-300 border-dashed"></div>
          <img src="/divider.svg" className="w-full rotate-180"/>
          <img src="/geometric-patterns.svg" className="left-0 w-full absolute bottom-0"/>
      </div>
      <section className="bg-violet-600">
        <MaxWidthWrapper classname="px-3 py-24 border-none">
          <div className="text-center">
            <h2 className="font-bold text-white text-3xl lg:text-5xl">Criar. Colaborar. Aprender.</h2>
            <p className="text-white text-xl lg:text-2xl">Ajude o mundo com suas ações.</p>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

