// utils/dateUtils.ts
import { BadRequestError } from '@/http/_errors/bad-request-error'

export function calcularDuracaoEmMinutos(
  dataInicio: Date,
  dataFim: Date,
): { duracaoMinutos: number } {
  const diferencaEmMs = dataFim.getTime() - dataInicio.getTime()
  const duracaoMinutos = Math.floor(diferencaEmMs / (1000 * 60))

  if (duracaoMinutos < 0) {
    throw new BadRequestError(
      'Data de fim não pode ser anterior à data de início',
    )
  }

  return {
    duracaoMinutos,
  }
}
