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

export function converterMoedaParaNumber(str?: string): number {
  if (!str) {
    throw new Error('Nenhuma string foi fornecida')
  }
  // Remove espaços, símbolo R$ e normaliza para formato numérico
  const numeroLimpo = str
    .replace(/\s+/g, '') // Remove espaços
    .replace(/R\$\s*/, '') // Remove R$ com possíveis espaços
    .replace(/\./g, '') // Remove pontos (separadores de milhares)
    .replace(',', '.') // Troca vírgula por ponto decimal

  const numero = Number(numeroLimpo)

  if (isNaN(numero)) {
    throw new Error(`Formato inválido: "${str}"`)
  }

  return numero
}
