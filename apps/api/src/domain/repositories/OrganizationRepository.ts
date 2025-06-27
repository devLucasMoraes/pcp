import { AppDataSource } from '@/database/data-source'

import { Organization } from '../entities/Organization'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor() {
    const repository = AppDataSource.getRepository(Organization)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<Organization>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByUserId(
    userId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Organization>> {
    return this.paginate(
      pageRequest,
      {
        members: {
          user: { id: userId },
        },
      },
      { members: true },
    )
  }
}
