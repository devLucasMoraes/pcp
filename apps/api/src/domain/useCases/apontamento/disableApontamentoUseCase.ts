import { Apontamento } from '@/domain/entities/Apontamento'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const disableApontamentoUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.apontamento.manager.transaction(async (manager) => {
      const apontamento = await manager.findOne(Apontamento, {
        where: { id },
        select: ['id'],
      })

      if (!apontamento) {
        throw new BadRequestError('Apontamento não encontrado')
      }

      await manager.update(Apontamento, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Apontamento, id)
    })
  },
}
