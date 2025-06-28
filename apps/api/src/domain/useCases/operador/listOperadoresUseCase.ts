import { Member } from '@/domain/entities/Member'
import { Operador } from '@/domain/entities/Operador'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listOperadoresUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Operador>> {
    return await repository.operador.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
