import { format, isValid, parse, parseISO } from 'date-fns'

export function formatarDateBR(
  dateInput: string | Date | null | undefined,
): string {
  if (!dateInput) {
    return 'N/A' // Handle null or undefined input
  }
  try {
    // parseISO handles strings, Date objects can be passed directly to format
    const dateObj =
      typeof dateInput === 'string' ? parseISO(dateInput) : dateInput

    // Check if the parsed date is valid
    if (!isValid(dateObj)) {
      console.warn('Invalid date received:', dateInput)
      return 'Data inválida'
    }

    return format(dateObj, 'dd/MM/yyyy HH:mm')
  } catch (error) {
    console.error('Error formatting date:', dateInput, error)
    return 'Erro' // Return an error indicator
  }
}

export function parseDate(dateString?: string): Date {
  if (!dateString) {
    throw new Error('Data inválida')
  }
  const date = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date())

  if (!isValid(date)) {
    throw new Error(`Formato inválido: ${dateString}`)
  }

  return date
}

export function formatarMinutosParaHHMM(minutos: number): string {
  if (isNaN(minutos)) return '00:00'

  const horas = Math.floor(minutos / 60)
  const minutosRestantes = minutos % 60

  return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`
}
