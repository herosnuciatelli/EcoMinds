'use client'

import { Button } from '@/components/ui/button'
import { MAX_PROJECTS_PER_REQUEST } from '@/constants'
import { toast } from '@/hooks/use-toast'
import { ProjectType } from '@/types/Projects'
import { createClient } from '@/utils/supabase/client'
import { Dispatch, SetStateAction, useState } from 'react'

export function GetMoreProjectsButton({ 
    canGetMoreProjects,
    params,
    projects,
    setCanGetMoreProjects,
    setProjects,
    author_id,
    pagination,
    setPagination
}: {
    projects: ProjectType[]
    author_id?: string
    setProjects: Dispatch<SetStateAction<ProjectType[]>>
    setCanGetMoreProjects: Dispatch<SetStateAction<boolean>>
    canGetMoreProjects: boolean
    params: {
        search: string | null;
    }
    pagination: { start: number, end: number }
    setPagination: Dispatch<SetStateAction<{
        start: number;
        end: number;
    }>>
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const supabase = createClient()

    const handleMoreProjects = async () => {
        setPagination(prev => ({ start: prev.end + 1, end: prev.end + (MAX_PROJECTS_PER_REQUEST + 1)}))
        setIsLoading(true)
        try {
            const { data: posts } = await supabase
                .from('projects')
                .select('*')
                .ilike('author', `${author_id || ''}%`)
                .ilike('title', `%${params.search || ''}%`)
                .range(pagination.start, pagination.end)
            
            if (posts) {
                if(!posts[0]) {
                    setCanGetMoreProjects(false)

                    return toast({
                        title: 'Não há mais projetos a serem buscados!',
                    })
                }
                setProjects([...projects, ...posts])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <Button 
            onClick={handleMoreProjects} 
            variant={'ghost'}
            isLoading={isLoading}
            disabled={isLoading}
        >
            Ver mais
        </Button>
    )
}