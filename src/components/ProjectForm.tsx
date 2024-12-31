'use client'

import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import MDEditor from "@uiw/react-md-editor"
import { redirect } from 'next/navigation'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from './ui/textarea'
import { IconClipboardCopy, IconCloudUp, IconPhotoScan } from '@tabler/icons-react'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from './ui/form'
import {createPitch} from "@/lib/actions/pitch";

import { formSchema } from '@/types/Projects'
import { createClient } from '@/utils/supabase/client'

import { parseNameToStorage } from '@/lib/utils'
import { useTransition } from 'react'

export function ProjectForm() {
    const { toast } = useToast()
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

    const handleCreateProject = async (projectData: z.infer<typeof formSchema>) => {
        // TODO: submit content to right ways
        startTransition(async () => {
            const supabase = createClient()
            const { 
                description,
                image,
                pitch,
                title,
                projectFile,
                videoURL
            } = projectData
            
            try {
    
                const imageStorageName = parseNameToStorage(image.name)
                if (imageStorageName) {
                    const { error } = await supabase.storage.from('images').upload(imageStorageName, image)
                    if (error) throw new Error(error.message)
                }
                
                const fileStorageName = parseNameToStorage(projectFile?.name)
                if (fileStorageName && projectFile) {
                    const { error } = await supabase.storage.from('projects').upload(fileStorageName, projectFile)
                    if (error) throw new Error(error.message)
                }
    
                const result = await createPitch({ 
                    description, 
                    image: imageStorageName, 
                    pitch, 
                    title, 
                    project: imageStorageName, 
                    videoURL
                })
    
                if (result.status = "SUCCESS") {
                    toast({
                        title: projectData.title,
                        description: "O projeto foi criado com sucesso.",
                        variant: 'success'
                    })
                }
    
                setTimeout(() => {
                    redirect(`/project/${result._id}`)
                }, 800)
            } catch (error) {
                const { message } = error as { message: string }
    
                toast({
                    title: 'Erro: Erro ao armazenar os arquivos.',
                    description: message,
                    variant: 'destructive'
                })
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleCreateProject)} className='mx-auto max-w-3xl py-3'>
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
                        Enviar <IconCloudUp />
                    </Button>
                </div>
            </form>

        </Form>
    )
}