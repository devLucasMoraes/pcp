import { Member } from '@/domain/entities/Member'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const disableOrdemProducaoUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.ordemProducao.manager.transaction(async (manager) => {
      const ordemProducao = await manager.findOne(OrdemProducao, {
        where: { id },
        select: ['id'],
      })

      if (!ordemProducao) {
        throw new BadRequestError('Ordem de Produção não encontrada')
      }

      await manager.update(OrdemProducao, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(OrdemProducao, id)
    })
  },
}
