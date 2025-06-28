import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const disableOcorrenciaUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.ocorrencia.manager.transaction(async (manager) => {
      const ocorrencia = await manager.findOne(Ocorrencia, {
        where: { id },
        select: ['id'],
      })

      if (!ocorrencia) {
        throw new BadRequestError('Ocorrencia não encontrada')
      }

      await manager.update(Ocorrencia, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Ocorrencia, id)
    })
  },
}
