import { Apontamento } from '@/domain/entities/Apontamento'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listApontamentosUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Apontamento>> {
    return await repository.apontamento.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
