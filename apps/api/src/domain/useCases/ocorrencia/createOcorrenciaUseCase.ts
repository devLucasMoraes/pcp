import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateOcorrenciaDTO } from '@/http/routes/ocorrencia/create-ocorrencia'

export const createOcorrenciaUseCase = {
  async execute(
    dto: CreateOcorrenciaDTO,
    membership: Member,
  ): Promise<Ocorrencia> {
    return repository.ocorrencia.manager.transaction(async (manager) => {
      const existingOcorrencia = await manager.findOne(Ocorrencia, {
        where: {
          descricao: dto.descricao,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'descricao', 'deletedAt'],
      })

      if (existingOcorrencia) {
        throw new BadRequestError(
          existingOcorrencia.deletedAt
            ? `Ocorrência "${existingOcorrencia.descricao}" desativada`
            : `Ocorrência "${existingOcorrencia.descricao}" já cadastrada`,
        )
      }

      const ocrrToSave = repository.ocorrencia.create({
        descricao: dto.descricao,
        cor: dto.cor,
        organizationId: membership.organization.id,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
      })

      const ocorrencia = await manager.save(ocrrToSave)

      return ocorrencia
    })
  },
}
