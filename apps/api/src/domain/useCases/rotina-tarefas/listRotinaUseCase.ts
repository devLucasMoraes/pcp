import { Member } from '@/domain/entities/Member'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listRotinaUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<RotinaTarefas>> {
    return await repository.rotinaTarefas.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
