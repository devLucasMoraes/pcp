import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listOcorrenciaUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Ocorrencia>> {
    return await repository.ocorrencia.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
