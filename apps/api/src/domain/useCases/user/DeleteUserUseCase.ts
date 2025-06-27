import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { User } from '../../entities/User'

export const deleteUserUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.user.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id },
        select: ['id', 'deletedAt'],
      })

      if (!user) {
        throw new BadRequestError('Usuário não encontrado')
      }

      if (user.deletedAt) {
        throw new BadRequestError('Usuário já está desativado')
      }

      await manager.update(User, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(User, id)
    })
  },
}
