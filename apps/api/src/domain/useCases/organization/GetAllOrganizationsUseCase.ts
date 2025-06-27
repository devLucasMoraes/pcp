import { Organization } from '@/domain/entities/Organization'

import { repository } from '../../repositories'

export const getAllOrganizationsUseCase = {
  async execute(userId: string): Promise<Organization[]> {
    return await repository.organization.find({
      where: {
        members: {
          user: { id: userId }, // Filtra organizações que tenham membros com o userId
        },
      },
      relations: { members: true }, // Carrega a relação members
      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
        members: {
          // Seleciona apenas o campo "role" dos membros
          role: true,
        },
      },
    })
  },
}
