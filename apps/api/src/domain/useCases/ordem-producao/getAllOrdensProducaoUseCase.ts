import { Member } from '@/domain/entities/Member'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'

export const getAllOrdensProducaoUseCase = {
  async execute(membership: Member): Promise<OrdemProducao[]> {
    return await repository.ordemProducao.find({
      where: {
        organizationId: membership.organization.id,
      },
    })
  },
}
