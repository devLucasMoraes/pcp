import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { repository } from '@/domain/repositories'

export const getAllOcorrenciaUseCase = {
  async execute(membership: Member): Promise<Ocorrencia[]> {
    return await repository.ocorrencia.find({
      where: {
        organizationId: membership.organization.id,
      },
    })
  },
}
