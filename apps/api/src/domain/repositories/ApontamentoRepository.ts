import { AppDataSource } from '@/database/data-source'

import { Apontamento } from '../entities/Apontamento'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class ApontamentoRepository extends BaseRepository<Apontamento> {
  constructor() {
    const repository = AppDataSource.getRepository(Apontamento)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<Apontamento>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Apontamento>> {
    return this.paginate(
      pageRequest,
      {
        organizationId,
      },
      {
        equipamento: true,
        ocorrencia: true,
        operador: true,
        ordemProducao: true,
      },
    )
  }
}
