import { Member } from '@/domain/entities/Member'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const disableRotinaUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.rotinaTarefas.manager.transaction(async (manager) => {
      const rotina = await manager.findOne(RotinaTarefas, {
        where: { id },
        select: ['id'],
      })

      if (!rotina) {
        throw new BadRequestError('Rotina não encontrada')
      }

      await manager.update(RotinaTarefas, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(RotinaTarefas, id)
    })
  },
}
