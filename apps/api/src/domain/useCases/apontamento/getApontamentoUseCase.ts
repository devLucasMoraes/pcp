import { Apontamento } from '@/domain/entities/Apontamento'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getApontamentoUseCase = {
  async execute(id: string): Promise<Apontamento> {
    const apontamento = await repository.apontamento.findOne({
      where: {
        id,
      },
      relations: {
        equipamento: true,
        ocorrencia: true,
        operador: true,
        ordemProducao: true,
      },
    })

    if (!apontamento) {
      throw new BadRequestError('Apontamento não encontrado')
    }

    return apontamento
  },
}
