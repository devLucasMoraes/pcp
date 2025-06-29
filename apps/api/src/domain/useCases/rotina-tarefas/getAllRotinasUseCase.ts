import { Member } from '@/domain/entities/Member'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'

export const getAllRotinasUseCase = {
  async execute(membership: Member): Promise<RotinaTarefas[]> {
    return await repository.rotinaTarefas.find({
      where: {
        organizationId: membership.organization.id,
      },
      relations: {
        tarefas: {
          ocorrencia: true,
        },
      },
    })
  },
}
