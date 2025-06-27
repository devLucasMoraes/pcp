import { AppDataSource } from '@/database/data-source'

import { User } from '../entities/User'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class UserRepository extends BaseRepository<User> {
  constructor() {
    const repository = AppDataSource.getRepository(User)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<User>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<User>> {
    return this.paginate(
      pageRequest,
      {
        memberOn: {
          organization: { id: organizationId },
        },
      },
      { memberOn: true },
    )
  }
}
