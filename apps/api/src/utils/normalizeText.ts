export function normalizeText(text: string): string {
  return text
    .toString()
    .normalize('NFKD') // Decompõe caracteres acentuados
    .trim() // Remove espaços extras no início/fim
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/_/g, '-') // Substitui underscores por hífens
    .replace(/--+/g, '-') // Remove hífens consecutivos
    .replace(/^-+/, '') // Remove hífens do início
    .replace(/-+$/, '') // Remove hífens do final
}
