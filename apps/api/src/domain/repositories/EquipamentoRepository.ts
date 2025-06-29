import { AppDataSource } from '@/database/data-source'

import { Equipamento } from '../entities/Equipamento'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class EquipamentoRepository extends BaseRepository<Equipamento> {
  constructor() {
    const repository = AppDataSource.getRepository(Equipamento)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<Equipamento>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Equipamento>> {
    return this.paginate(
      pageRequest,
      {
        organizationId,
      },
      {
        rotinaTarefas: true,
      },
    )
  }
}
