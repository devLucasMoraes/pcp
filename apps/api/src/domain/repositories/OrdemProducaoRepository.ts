import { AppDataSource } from '@/database/data-source'

import { OrdemProducao } from '../entities/OrdemProducao'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class OrdemProducaoRepository extends BaseRepository<OrdemProducao> {
  constructor() {
    const repository = AppDataSource.getRepository(OrdemProducao)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<OrdemProducao>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<OrdemProducao>> {
    return this.paginate(pageRequest, {
      organizationId,
    })
  }
}
