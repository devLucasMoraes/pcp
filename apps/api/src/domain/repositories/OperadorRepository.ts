import { AppDataSource } from '@/database/data-source'

import { Operador } from '../entities/Operador'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class OperadorRepository extends BaseRepository<Operador> {
  constructor() {
    const repository = AppDataSource.getRepository(Operador)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Operador>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Operador>> {
    return this.paginate(pageRequest, {
      organizationId,
    })
  }
}
