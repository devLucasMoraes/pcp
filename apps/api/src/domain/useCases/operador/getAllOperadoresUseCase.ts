import { Member } from '@/domain/entities/Member'
import { Operador } from '@/domain/entities/Operador'
import { repository } from '@/domain/repositories'

export const getAllOperadoresUseCase = {
  async execute(membership: Member): Promise<Operador[]> {
    return await repository.operador.find({
      where: {
        organizationId: membership.organization.id,
      },
    })
  },
}
