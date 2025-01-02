'use client'

import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import MDEditor from "@uiw/react-md-editor"

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from './ui/textarea'
import { IconClipboardCopy, IconPhotoScan } from '@tabler/icons-react'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from './ui/form'
import { ReactNode, useTransition } from 'react'
import { formSchema } from '@/types/Projects'
import { PROJECT_BY_ID_QUERYResult } from '@/sanity/types'
import { getFileName } from '@/lib/utils'

export function ProjectForm({ action, children, post }: {
    action: ({projectData, postData}: {
        projectData: z.infer<typeof formSchema>
        postData?: PROJECT_BY_ID_QUERYResult
    }) => Promise<void>
    children: ReactNode
    post?: PROJECT_BY_ID_QUERYResult
}) {
    const [isLoading, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post?.title || '',
            description: post?.description || '',
            pitch: post?.pitch || '',
            video: post?.video || undefined,
        }
    })

    const { handleSubmit } = form

    const handleAction = async (projectData: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            await action({projectData, postData: post})
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleAction)} className='mx-auto max-w-3xl py-3'>
                <div className='py-1.5'>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel className='text-sm font-bold' htmlFor="title">Título</FormLabel>
                                    <FormControl>
                                        <Input 
                                            id='title' 
                                            placeholder='Título do Projeto' 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </div>

                <div className='py-1.5'>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className='text-sm font-bold' htmlFor="description">Descrição</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id='description'
                                        placeholder='Este projeto...'
                                        rows={5}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='py-1.5'>
                    <FormField
                        control={form.control}
                        name="video"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-bold' htmlFor="videoURL">Vídeo Link [opcional]</FormLabel>
                                <FormControl>
                                    <Input
                                        id='videoURL'
                                        placeholder='https://example.com'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='py-1.5'>
                    <FormField
                        control={form.control}
                        name="pitch"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel className='text-sm font-bold' htmlFor="md">Apresentação</FormLabel>
                                    <FormControl>
                                        <MDEditor
                                            id='md'
                                            height={300}
                                            style={{
                                                borderRadius: 8,
                                                overflow: 'hidden'
                                            }}
                                            previewOptions={{
                                                disallowedElements: ["style"]
                                            }}
                                            textareaProps={{
                                                placeholder: "Descreva seu projeto."
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </div>

                <div className='py-1.5 grid md:grid-cols-2 gap-3'>
                    <div>
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => {
                                const handleFileInputChange = (
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const files = event.target.files
                                    if (files) {
                                        form.setValue('image', files[0])
                                    }
                                }

                                return (
                                    <FormItem>
                                        <FormLabel className='text-sm font-bold' htmlFor="image">Imagem</FormLabel>
                                        <div
                                            onClick={() => document.getElementById('image')?.click()}
                                            className='relative h-20 w-full border rounded-md border-dashed border-stone-600 flex items-center px-5 cursor-pointer hover:bg-stone-100 justify-between'
                                        >
                                            <span className='text-sm'>{(field.value?.name || post?.image) ? field.value?.name ||  getFileName(post?.image) : 'Adicionar Imagem.'}</span>

                                            <IconPhotoScan size={40} stroke={1} />
                                            <FormControl>
                                                <input
                                                    id='image'
                                                    type='file'
                                                    className='hidden'
                                                    onChange={handleFileInputChange}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="project"
                            render={({ field }) => {
                                const handleFileInputChange = (
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const files = event.target.files
                                    if (files) {
                                        form.setValue('project', files[0])
                                    }
                                }

                                return (
                                    <FormItem>
                                        <FormLabel className='text-sm font-bold' htmlFor="projectFile">Projeto (.pdf)[opcional]</FormLabel>
                                        <div
                                            onClick={() => document.getElementById('projectFile')?.click()}
                                            className='relative h-20 w-full border rounded-md border-dashed border-stone-600 flex items-center px-5 cursor-pointer hover:bg-stone-100 justify-between'
                                        >
                                            <span className='text-sm'>{field.value?.name || post?.project ? field.value?.name || getFileName(post?.project): 'Adicionar Projeto.'}</span>

                                            <IconClipboardCopy size={40} stroke={1} />
                                            <FormControl>
                                                <input
                                                    id='projectFile'
                                                    type='file'
                                                    className='hidden'
                                                    onChange={handleFileInputChange}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                </div>
                <div className='grid'>
                    <Button
                        type='submit'
                        className='mt-5 mx-auto shadow-2xl'
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {children}
                    </Button>
                </div>
            </form>

        </Form>
    )
}