import { Member } from '@/domain/entities/Member'
import { User } from '@/domain/entities/User'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listUserUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<User>> {
    return await repository.user.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
