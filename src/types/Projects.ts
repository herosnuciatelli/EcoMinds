import { Author, Project, Slug } from "@/sanity/types";
import {z} from "zod";
import {ErrorsWarnings} from "@/utils/errors-warnings";

export type ProjectCardType = Omit<
  Project,
  "author" | "_type" | "_updatedAt" | "_rev" | "title" | "slug" | "views" | "description" | "image" | "pitch"
> & {
  author?: Author | null;
  title: string | null;
  slug: Slug | null;
  views: number | null;
  description: string | null;
  image: string | null;
};

export const formSchema = z.object({
  title: z.string()
      .min(1, ErrorsWarnings.emptyField)
      .max(100, ErrorsWarnings.overCaractersField)
      .trim(),
  description: z.string()
      .min(1, ErrorsWarnings.emptyField)
      .max(1000, ErrorsWarnings.overCaractersField)
      .trim(),
  videoURL: z.string().url(ErrorsWarnings.invalidURL).optional(),
  image: z.instanceof(File)
      .refine((file) => {
        const MAX_UPLOAD_SIZE = 1024 * 1024 * 5
        return !file || file.size <= MAX_UPLOAD_SIZE
      }, 'O arquivo deve ter menos de 5MB')
      .refine((file) => {
        if (!file?.name) return false

        const extensionsAvailable = ['.svg', '.png', '.jpg']

        for (const extension of extensionsAvailable) {
          if (file.name.endsWith(extension)) {
            return true
          }
        }

        return false
      }, 'A extensão não é válida. Aceitamos apenas .svg, .png, .jpg'),
  projectFile: z.instanceof(File)
      .refine((file) => {
        const MAX_UPLOAD_SIZE = 1024 * 1024 * 50
        return !file || file.size <= MAX_UPLOAD_SIZE
      }, 'O arquivo deve ter menos de 50MB')
      .refine((file) => {
        if (!file?.name) return false

        const extensionAvailable = '.pdf'

        return file.name.endsWith(extensionAvailable);
      }, 'A extensão não é válida. Aceitamos apenas .pdf')
      .optional(),
  pitch: z.string().min(1, ErrorsWarnings.emptyField)
})