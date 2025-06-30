import { Member } from '@/domain/entities/Member'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listOrdensProducaoUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<OrdemProducao>> {
    return await repository.ordemProducao.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
