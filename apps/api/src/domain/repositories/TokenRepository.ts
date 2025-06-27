import { AppDataSource } from '@/database/data-source'

import { Token } from '../entities/Token'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class TokenRepository extends BaseRepository<Token> {
  constructor() {
    const repository = AppDataSource.getRepository(Token)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Token>> {
    return this.paginate(pageRequest)
  }
}
