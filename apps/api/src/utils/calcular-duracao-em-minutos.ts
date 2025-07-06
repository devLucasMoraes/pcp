// utils/dateUtils.ts
import { BadRequestError } from '@/http/_errors/bad-request-error'

export function calcularDuracaoEmMinutos(
  dataInicioStr: string,
  dataFimStr: string,
): { duracaoMinutos: number } {
  const dataInicio = new Date(dataInicioStr)
  const dataFim = new Date(dataFimStr)

  if (isNaN(dataInicio.getTime())) {
    throw new BadRequestError('Data de início inválida')
  }
  if (isNaN(dataFim.getTime())) {
    throw new BadRequestError('Data de fim inválida')
  }

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
