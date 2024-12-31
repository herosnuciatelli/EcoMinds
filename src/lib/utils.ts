import { clsx, type ClassValue } from "clsx"
import slugify from "slugify"
import { twMerge } from "tailwind-merge"
import { ulid } from "ulid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response))
}

export function parseNameToStorage(name?: string) {
  if (!name) return undefined
  const slug = slugify(name, { lower: true, strict: true })
  const path = slug + '-' + ulid()

  return path
}