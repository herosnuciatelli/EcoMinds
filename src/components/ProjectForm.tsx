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

export function ProjectForm({action, children }:{
    action: (projectData: z.infer<typeof formSchema>) => Promise<void>
    children: ReactNode
}) {
    const [isLoading, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            pitch: '',
        }
    })
    const { handleSubmit } = form

    const handleAction = async (projectData: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            await action(projectData)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleAction)} className='mx-auto max-w-3xl py-3'>
                <div className='py-1.5'>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-bold' htmlFor="title">Título</FormLabel>
                                <FormControl>
                                    <Input id='title' placeholder='Título do Projeto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='py-1.5'>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
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
                        name="videoURL"
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
                                            value={field.value}
                                            onChange={(value) => {
                                                form.setValue('pitch', value || '')
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}}
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
                                            <span className='text-sm'>{field.value?.name ? field.value.name : 'Adicionar Imagem.'}</span>

                                            <IconPhotoScan size={40} stroke={1} />
                                            <FormControl>
                                                <input
                                                    id='image'
                                                    placeholder='Este projeto...'
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
                            name="projectFile"
                            render={({ field }) => {
                                const handleFileInputChange = (
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const files = event.target.files
                                    if (files) {
                                        form.setValue('projectFile', files[0])
                                    }
                                }

                                return (
                                    <FormItem>
                                        <FormLabel className='text-sm font-bold' htmlFor="projectFile">Projeto (.pdf)[opcional]</FormLabel>
                                        <div
                                            onClick={() => document.getElementById('projectFile')?.click()}
                                            className='relative h-20 w-full border rounded-md border-dashed border-stone-600 flex items-center px-5 cursor-pointer hover:bg-stone-100 justify-between'
                                        >
                                            <span className='text-sm'>{field.value?.name ? field.value.name : 'Adicionar Projeto.'}</span>

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