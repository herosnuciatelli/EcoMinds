'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { client } from '@/sanity/lib/client'
import { GET_MORE_PROJECTS } from '@/sanity/lib/queries'
import { ProjectType } from '@/types/Projects'
import { Dispatch, SetStateAction, useState } from 'react'

export function GetMoreProjectsButton({ projects, setProjects, setCanGetMoreProjects, canGetMoreProjects, params }: {
    projects: ProjectType[]
    setProjects: Dispatch<SetStateAction<ProjectType[]>>
    setCanGetMoreProjects: Dispatch<SetStateAction<boolean>>
    canGetMoreProjects: boolean
    params: {
        search: string | null;
    }
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const getLastId = (projectsArray: ProjectType[]) => {
        const lastProject = projectsArray[projectsArray.length - 1]

        return lastProject?._id
    }

    const handleMoreProjects = async () => {
        setIsLoading(true)

        try {
            const lastId = getLastId(projects)
            if (!lastId) throw new Error('Não foi possível coletar o ultimo projeto.')

            const result = await client.fetch(GET_MORE_PROJECTS, { lastId, search: params.search })

            if (result.length === 0 || !canGetMoreProjects) {
                setCanGetMoreProjects(false)
                return toast({
                    title: 'Não há mais projetos a serem buscados!',
                })
            }
            setProjects(prevProjects => [...prevProjects, ...result])

        } catch (error) {
            const { message } = error as { message: string }

            toast({
                title: message
            })
        } finally {
            setIsLoading(false)
        }


    }
    return (
        <Button onClick={handleMoreProjects} variant={'ghost'} isLoading={isLoading}>Ver mais</Button>
    )
}