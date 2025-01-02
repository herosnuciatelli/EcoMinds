import { clsx, type ClassValue } from "clsx"
import slugify from "slugify"
import { twMerge } from "tailwind-merge"
import { ulid } from "ulid"

const mimeTypesAllowed = ['png', 'jpg', 'svg', 'pdf']

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response))
}

export function parseNameToStorage(name: string | undefined) {
  if (!name) return undefined
  const slug = slugify(name, { lower: true, strict: true })
  const path = slug + '-' + ulid()

  return path
}

export function getFileName(url: string | undefined | null){
  const file = getFileFullName(url)
  if (!file) {
    throw new Error("URL inválida: nenhum arquivo encontrado.");
  }

  const uuidSeparator = file.lastIndexOf('-')
  
  let fileName = file.slice(0, uuidSeparator)

  for (const ext of mimeTypesAllowed) {
    if (fileName.endsWith(ext)) {
      return  fileName = fileName.replace(ext, `.${ext}`);
    }
  }

  return fileName
}

export function getFileFullName(url: string | undefined | null){
  if (!url) return undefined

  const file = url.split('/').pop()
  if (!file) {
    throw new Error("URL inválida: nenhum arquivo encontrado.");
  }

  return file
}

export function isValidPath(path:string) {
  const endpoint = path.split('/').pop()
  
  if (endpoint == 'undefined' || endpoint == 'null') {
    return false
  }
  
  return !!endpoint
}