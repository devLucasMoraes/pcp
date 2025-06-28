import { Member } from '@/domain/entities/Member'
import { Operador } from '@/domain/entities/Operador'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const disableOperadorUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.operador.manager.transaction(async (manager) => {
      const operador = await manager.findOne(Operador, {
        where: { id },
        select: ['id'],
      })

      if (!operador) {
        throw new BadRequestError('Operador não encontrado')
      }

      await manager.update(Operador, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Operador, id)
    })
  },
}
