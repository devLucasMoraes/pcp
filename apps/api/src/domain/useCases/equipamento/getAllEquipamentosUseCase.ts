import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

export const getAllEquipamentosUseCase = {
  async execute(membership: Member): Promise<Equipamento[]> {
    return await repository.equipamento.find({
      where: {
        organizationId: membership.organization.id,
      },
      relations: {
        rotinaTarefas: true,
      },
    })
  },
}
