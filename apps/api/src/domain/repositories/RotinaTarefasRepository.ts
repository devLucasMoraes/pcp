import { AppDataSource } from '@/database/data-source'

import { RotinaTarefas } from '../entities/RotinaTarefas'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class RotinaTarefasRepository extends BaseRepository<RotinaTarefas> {
  constructor() {
    const repository = AppDataSource.getRepository(RotinaTarefas)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<RotinaTarefas>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<RotinaTarefas>> {
    return this.paginate(
      pageRequest,
      {
        organizationId,
      },
      {
        tarefas: {
          ocorrencia: true,
        },
      },
    )
  }
}
