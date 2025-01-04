import { client } from "@/sanity/lib/client"
import { PROJECT_OTHERS_QUERY } from "@/sanity/lib/queries"
import { ProjectCard } from "./ProjectCard"
import { ProjectType } from "@/types/Projects"

export async function AnotherProjects({id}: {
    id: string
}) {
    const posts = await client.fetch(PROJECT_OTHERS_QUERY, {id})
    return (
          <ul className="py-3 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {posts.length > 0 ? (
              posts.map((post: ProjectType, index: number) => (
                <ProjectCard
                  variant="vertical"
                  post={post}
                  key={index}
                />
              ))
            ): (
              <p className="font-semibold text-sm">Nenhum projeto encontrado.</p>
            )}
        </ul>
    )
}