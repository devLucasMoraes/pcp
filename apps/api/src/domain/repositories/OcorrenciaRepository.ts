import { AppDataSource } from '@/database/data-source'

import { Ocorrencia } from '../entities/Ocorrencia'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class OcorrenciaRepository extends BaseRepository<Ocorrencia> {
  constructor() {
    const repository = AppDataSource.getRepository(Ocorrencia)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Ocorrencia>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Ocorrencia>> {
    return this.paginate(pageRequest, {
      organizationId,
    })
  }
}
