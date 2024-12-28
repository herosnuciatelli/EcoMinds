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
import { Textarea } from './ui/textarea'
import { IconClipboardCopy, IconPhotoScan } from '@tabler/icons-react'

const formSchema = z.object({
    title: z.string()
        .min(1, ErrorsWarnings.emptyField)
        .max(100, ErrorsWarnings.overCaractersField)
        .trim(),
    description: z.string()
        .min(1, ErrorsWarnings.emptyField)
        .max(1000, ErrorsWarnings.overCaractersField)
        .trim(),
    image: z.instanceof(FileList)
        .transform(list => list.item(0))
        .refine((file) => {
            const MAX_UPLOAD_SIZE = 1024 * 1024 * 5
            return !file || file.size <= MAX_UPLOAD_SIZE
        }, 'O arquivo deve ter menos de 5MB')
        .refine((file) => {
            if (!file?.name) return false

            const extensionsAvaliable = ['.svg', '.png', '.jpg']

            for (const extension of extensionsAvaliable) {
                if (file.name.endsWith(extension)) {
                    return true
                }
            }

            return false
        }, 'A extensão não é válida. Aceitamos apenas .svg, .png, .jpg'),
    projectFile: z.instanceof(FileList)
        .transform(list => list.item(0))
        .refine((file) => {
            const MAX_UPLOAD_SIZE = 1024 * 1024 * 20
            return !file || file.size <= MAX_UPLOAD_SIZE
        }, 'O arquivo deve ter menos de 20MB')
        .refine((file) => {
            if (!file?.name) return false

            const extensionAvaliable = '.pdf'

            if (file.name.endsWith(extensionAvaliable)) {
                return true
            }

            return false
        }, 'A extensão não é válida. Aceitamos apenas .pdf'),

})

export function ProjectForm() {
    const [pitch, setPitch] = useState("")
    const [image, setImage] = useState("")
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
        <form onSubmit={handleSubmit(handleCreateProject)} className='mx-auto max-w-3xl'>
            <div className='py-1.5'>
                <label htmlFor="title" className='text-sm font-bold'>Título</label>
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

            <div className='py-1.5'>
                <label htmlFor="description" className='text-sm font-bold'>Descrição</label>
                <Textarea
                    id='description'
                    placeholder='Este projeto...'
                    rows={5}
                    {...register('description')}
                />
                {formState.errors.description && (
                    <ErrorWarning>
                        <ErrorWarning.Title>{formState.errors.description.message}</ErrorWarning.Title>
                    </ErrorWarning>
                )}
            </div>

            <div className='py-1.5 grid grid-cols-2 gap-x-3'>
                <div>
                    <label htmlFor="image" className='text-sm font-bold'>Imagem</label>
                    <div
                        onClick={() => document.getElementById('image')?.click()}
                        className='relative h-20 w-full border rounded-md border-dashed border-stone-600 flex items-center px-5 cursor-pointer hover:bg-stone-100 justify-between'
                    >
                        <span className='text-sm'>Adicionar Imagem.</span>

                        <IconPhotoScan size={40} stroke={1} />

                        <Input
                            id='image'
                            placeholder='Este projeto...'
                            type='file'
                            className='hidden'
                            {...register('image')}
                        />
                    </div>

                    {formState.errors.image && (
                        <ErrorWarning>
                            <ErrorWarning.Title>{formState.errors.image.message}</ErrorWarning.Title>
                        </ErrorWarning>
                    )}
                </div>
                <div>
                    <label htmlFor="projectFile" className='text-sm font-bold'>Projeto <span className='text-rose-600'>.pdf</span></label>
                    <div
                        onClick={() => document.getElementById('projectFile')?.click()}
                        className='relative h-20 w-full border rounded-md border-dashed border-stone-600 flex items-center px-5 cursor-pointer hover:bg-stone-100 justify-between'
                    >
                        <span className='text-sm'>Adicionar Projeto.</span>

                        <IconClipboardCopy size={40} stroke={1} />

                        <Input
                            id='projectFile'
                            placeholder='Este projeto...'
                            type='file'
                            className='hidden'
                            {...register('projectFile')}
                        />
                    </div>

                    {formState.errors.image && (
                        <ErrorWarning>
                            <ErrorWarning.Title>{formState.errors.image.message}</ErrorWarning.Title>
                        </ErrorWarning>
                    )}
                </div>
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
                className='mt-3'
            >
                Criar
            </Button>
        </form>
    )
}