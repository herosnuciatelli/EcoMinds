import { client } from "@/sanity/lib/client"
import { PROJECT_ANOTHERS_QUERY } from "@/sanity/lib/queries"
import { ProjectCard } from "./ProjectCard"
import { ProjectCardType } from "@/types/Projects"

export async function View({id}: {
    id: string
}) {
    const posts = await client.fetch(PROJECT_ANOTHERS_QUERY, {id})

    return (
        <>
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
        </>
    )
}