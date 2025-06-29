import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listEquipamentosUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Equipamento>> {
    return await repository.equipamento.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
