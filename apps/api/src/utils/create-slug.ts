import { v4 as uuidv4 } from 'uuid'

export function createSlug(text: string): string {
  const baseSlug = text
    .toString()
    .normalize('NFKD') // Decompõe caracteres acentuados
    .toLowerCase() // Tudo em minúsculas
    .trim() // Remove espaços extras no início/fim
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/_/g, '-') // Substitui underscores por hífens
    .replace(/--+/g, '-') // Remove hífens consecutivos
    .replace(/^-+/, '') // Remove hífens do início
    .replace(/-+$/, '') // Remove hífens do final

  const uniqueSuffix = uuidv4().slice(0, 8) // você pode ajustar o tamanho se quiser
  return `${baseSlug}-${uniqueSuffix}`
}
