import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateOcorrenciaDTO } from '@/http/routes/ocorrencia/update-ocorrencia'

export const updateOcorrenciaUseCase = {
  async execute(
    id: string,
    dto: UpdateOcorrenciaDTO,
    membership: Member,
  ): Promise<Ocorrencia> {
    return repository.ocorrencia.manager.transaction(async (manager) => {
      const existingOcorrencia = await manager.findOne(Ocorrencia, {
        where: { id },
        select: ['id', 'descricao'],
      })

      if (!existingOcorrencia) {
        throw new BadRequestError('Ocorrência não encontrada')
      }

      if (dto.descricao !== existingOcorrencia.descricao) {
        const existingUser = await manager.findOne(Ocorrencia, {
          where: {
            descricao: dto.descricao,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'descricao', 'deletedAt'],
        })

        if (existingUser) {
          throw new BadRequestError(
            existingUser.deletedAt
              ? `Ocorrência "${existingUser.descricao}" desativada`
              : `Ocorrência "${existingUser.descricao}" já cadastrada`,
          )
        }
      }

      manager.merge(Ocorrencia, existingOcorrencia, {
        descricao: dto.descricao,
        cor: dto.cor,
        updatedBy: membership.user.id,
      })

      return manager.save(existingOcorrencia)
    })
  },
}
