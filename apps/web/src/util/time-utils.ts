export function formatarMinutosParaHHMM(minutos: number): string {
  if (isNaN(minutos)) return '00:00'

  const horas = Math.floor(minutos / 60)
  const minutosRestantes = minutos % 60

  return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`
}
