'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import MDEditor from "@uiw/react-md-editor"

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ErrorsWarnings } from '@/utils/errors-warnings'
import { ErrorWarning } from './ui/error-message'

const formSchema = z.object({
    title: z.string()
        .min(1, ErrorsWarnings.emptyField)
        .max(10, ErrorsWarnings.overCaractersField)
})

export function ProjectForm() {
    const [pitch, setPitch] = useState("")
    const { toast } = useToast()

    const { handleSubmit, formState, register } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    })

    const handleCreateProject = ({ title }: z.infer<typeof formSchema>) => {
        // TODO: submit content to right ways
        toast({
            title,
            description: "O projeto foi criado com sucesso.",
        })

    }

    return (
        <form onSubmit={handleSubmit(handleCreateProject)}>
            <div className='py-1.5'>
                <label htmlFor="title">Title</label>
                <Input
                    id='title'
                    placeholder='Título do Projeto'
                    {...register('title')}
                />
                {formState.errors.title && (
                    <ErrorWarning>
                        <ErrorWarning.Title>{formState.errors.title.message}</ErrorWarning.Title>
                    </ErrorWarning>
                )}
            </div>

            {/* <MDEditor 
                value={pitch}
                onChange={(value) => setPitch(value as string)}
                height={300}
                style={{
                    borderRadius: 8,
                    overflow: 'hidden'
                }}
                previewOptions={{
                    disallowedElements: ["style"]
                }}
                textareaProps={{
                    placeholder: "Resumidamente descreva seu projeto e seu objetivo."
                }}
            /> */}

            <Button
                type='submit'
            >
                Show Toast
            </Button>
        </form>
    )
}