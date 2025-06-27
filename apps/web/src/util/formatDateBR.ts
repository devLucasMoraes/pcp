import { format, isValid, parseISO } from 'date-fns'

export const formatDateBR = (
  dateInput: string | Date | null | undefined,
): string => {
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

    return format(dateObj, 'dd/MM/yyyy')
  } catch (error) {
    console.error('Error formatting date:', dateInput, error)
    return 'Erro' // Return an error indicator
  }
}
