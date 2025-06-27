import { Member } from '@/domain/entities/Member'

import { User } from '../../entities/User'
import { repository } from '../../repositories'

export const getAllUserUseCase = {
  async execute(membership: Member): Promise<User[]> {
    return await repository.user.find({
      where: {
        memberOn: {
          organization: { id: membership.organization.id },
        },
      },
      relations: { memberOn: true }, // Carrega a relação members
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        memberOn: {
          // Seleciona apenas o campo "role" dos membros
          role: true,
        },
      },
    })
  },
}
