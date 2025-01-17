'use client'

import { ProjectType } from "@/types/Projects";
import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { GetMoreProjectsButton } from "./ui/get-more-projects-button";
import { MAX_PROJECTS_PER_REQUEST } from "@/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";

export function StandartsProjects({ params, variant, id }: {
    params: {
        search: string | null;
    }
    variant: 'vertical' | 'horizontal'
    id?: string
}) {
    const [projects, setProjects] = useState<ProjectType[]>([])
    const [canGetMoreProjects, setCanGetMoreProjects] = useState<boolean>(false)
    const [pagination, setPagination] = useState({
        start: 6,
        end: MAX_PROJECTS_PER_REQUEST * 2 + 1
    })

    const supabase = createClient()

    const getProjects = async () => {
        // When a search is made we reset the pagination
        if (params.search) {
            setPagination({
                start: 6,
                end: MAX_PROJECTS_PER_REQUEST * 2 + 1
            })
        }

        try {
            const { data: posts } = await supabase
                .from('projects')
                .select('*')
                .order('id', { ascending: false })
                .ilike('author', `${id || ''}%`)
                .ilike('title', `%${params.search || ''}%`)
                .limit(6)

            if (!posts) return

            if (!posts[0]) {
                setCanGetMoreProjects(false)
                toast({
                    title: 'Não há mais projetos.'
                })
            }

            if (posts.length >= MAX_PROJECTS_PER_REQUEST) {
                setCanGetMoreProjects(true)
            }

            return setProjects([...posts])
        } catch (error) {
            const { message } = error as { message: string }
            toast({
                title: message
            })
        }
    }

    useEffect(() => {
        getProjects()
    }, [params])

    return (
        <>
            <ul className={cn("py-3 grid md:grid-cols-2 gap-1", {
                'lg:grid-cols-3 gap-3 gap-y-5': variant === 'vertical'
            })}>
                {projects.length > 0 ? projects.map((post: ProjectType) => {
                    return (
                        <ProjectCard
                            variant={variant}
                            post={post}
                            key={post.id}
                        />
                    )
                }) : (
                    <p className="font-semibold text-sm">Nenhum projeto encontrado.</p>
                )}
            </ul>
            {canGetMoreProjects && (
                <div className="flex justify-center mt-5">
                    <GetMoreProjectsButton
                        projects={projects}
                        setProjects={setProjects}
                        params={params}
                        setCanGetMoreProjects={setCanGetMoreProjects}
                        canGetMoreProjects={canGetMoreProjects}
                        author_id={id}
                        setPagination={setPagination}
                        pagination={pagination}
                    />
                </div>
            )}
        </>
    )
}