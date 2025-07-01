import { Apontamento } from '@/domain/entities/Apontamento'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

export const getAllApontamentosUseCase = {
  async execute(membership: Member): Promise<Apontamento[]> {
    return await repository.apontamento.find({
      where: {
        organizationId: membership.organization.id,
      },
      relations: {
        equipamento: true,
        ocorrencia: true,
        operador: true,
        ordemProducao: true,
      },
    })
  },
}
