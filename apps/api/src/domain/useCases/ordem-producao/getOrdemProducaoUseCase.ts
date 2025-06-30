import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getOrdemProducaoUseCase = {
  async execute(id: string): Promise<OrdemProducao> {
    const ordemProducao = await repository.ordemProducao.findOne({
      where: {
        id,
      },
    })

    if (!ordemProducao) {
      throw new BadRequestError('Ordem de Produção não encontrada')
    }

    return ordemProducao
  },
}
