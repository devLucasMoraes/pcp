import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getOcorrenciaUseCase = {
  async execute(id: string): Promise<Ocorrencia> {
    const ocorrencia = await repository.ocorrencia.findOneBy({ id })

    if (!ocorrencia) {
      throw new BadRequestError('Ocorrência não encontrada')
    }

    return ocorrencia
  },
}
