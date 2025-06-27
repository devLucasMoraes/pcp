import { AppDataSource } from '@/database/data-source'

import { Member } from '../entities/Member'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class MemberRepository extends BaseRepository<Member> {
  constructor() {
    const repository = AppDataSource.getRepository(Member)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Member>> {
    return this.paginate(pageRequest)
  }
}
