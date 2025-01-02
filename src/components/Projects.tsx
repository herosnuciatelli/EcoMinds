'use client'

import { client } from "@/sanity/lib/client";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { ProjectType } from "@/types/Projects";
import { useEffect, useState } from "react";
import { ProjectCard, ProjectHorizontalCard } from "./ProjectCard";
import { GetMoreProjectsButton } from "./ui/get-more-projects-button";
import { MAX_PROJECTS_PER_REQUEST } from "@/constants";

export function StandartsProjects({ params }: {
    params: {
        search: string | null;
    }
}) {
    const [projects, setProjects] = useState<ProjectType[]>([])
    const [canGetMoreProjects, setCanGetMoreProjects] = useState<boolean>(false)

    const getProjects = async () => {
        const posts = await client.fetch(PROJECT_QUERY, params)
        if (posts.length >= MAX_PROJECTS_PER_REQUEST) {
            setCanGetMoreProjects(true)
        }
        setProjects([...posts])
    }

    useEffect(() => {
        getProjects()
    }, [params])

    return (
        <>
            <ul className="py-3 grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-3">
                {projects.length > 0 ? projects.map((post: ProjectType) => (
                    <ProjectCard
                        post={post}
                        key={post._id}
                    />
                )) : (
                    <p className="font-semibold text-sm">Nenhum projeto encontrado.</p>
                )}
            </ul>
            {canGetMoreProjects && (
                <div className="flex justify-center">
                    <GetMoreProjectsButton
                        projects={projects}
                        setProjects={setProjects}
                        params={params}
                        setCanGetMoreProjects={setCanGetMoreProjects}
                        canGetMoreProjects={canGetMoreProjects}
                    />
                </div>
            )}

        </>
    )
}

export function HorizontalProjects({ params }: {
    params: {
        search: string | null;
    }
}) {
    const [projects, setProjects] = useState<ProjectType[]>([])
    const [canGetMoreProjects, setCanGetMoreProjects] = useState<boolean>(false)

    const getProjects = async () => {
        const posts = await client.fetch(PROJECT_QUERY, params)
        if (posts.length >= MAX_PROJECTS_PER_REQUEST) {
            setCanGetMoreProjects(true)
        }
        setProjects([...posts])
    }

    useEffect(() => {
        getProjects()
    }, [params])

    return (
        <>
            <ul className="py-3 grid justify-center md:grid-cols-2 gap-1">
                {projects.length > 0 ? projects.map((post: ProjectType) => (
                    <ProjectHorizontalCard
                        post={post}
                        key={post._id}
                    />
                )) : (
                    <p className="font-semibold text-sm">Nenhum projeto encontrado.</p>
                )}
            </ul>
            {canGetMoreProjects && (
                <div className="flex justify-center">
                    <GetMoreProjectsButton
                        projects={projects}
                        setProjects={setProjects}
                        params={params}
                        setCanGetMoreProjects={setCanGetMoreProjects}
                        canGetMoreProjects={canGetMoreProjects}
                    />
                </div>
            )}

        </>
    )
}