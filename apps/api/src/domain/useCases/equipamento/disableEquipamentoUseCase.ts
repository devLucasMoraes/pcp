import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const disableEquipamentoUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.equipamento.manager.transaction(async (manager) => {
      const equipamento = await manager.findOne(Equipamento, {
        where: { id },
        select: ['id'],
      })

      if (!equipamento) {
        throw new BadRequestError('Equipamento não encontrado')
      }

      await manager.update(Equipamento, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Equipamento, id)
    })
  },
}
