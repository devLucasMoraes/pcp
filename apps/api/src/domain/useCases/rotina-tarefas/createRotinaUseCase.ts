import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateRotinaTarefasDTO } from '@/http/routes/rotina-tarefas/create-rotina'

export const createRotinaUseCase = {
  async execute(
    dto: CreateRotinaTarefasDTO,
    membership: Member,
  ): Promise<RotinaTarefas> {
    return repository.rotinaTarefas.manager.transaction(async (manager) => {
      const existingRotina = await manager.findOne(RotinaTarefas, {
        where: {
          descricao: dto.descricao,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'descricao', 'deletedAt'],
      })

      if (existingRotina) {
        throw new BadRequestError(
          existingRotina.deletedAt
            ? `Rotina "${existingRotina.descricao}" desativada`
            : `Rotina "${existingRotina.descricao}" já cadastrada`,
        )
      }

      if (dto.tarefas.length === 0) {
        throw new BadRequestError(
          'Rotina de tarefas precisa ter pelo menos uma tarefa',
        )
      }

      for (const tarefa of dto.tarefas) {
        const existingOcorrencia = await manager.findOne(Ocorrencia, {
          where: {
            id: tarefa.ocorrenciaId,
            organizationId: membership.organization.id,
          },
          select: ['id', 'descricao'],
        })

        if (!existingOcorrencia) {
          throw new BadRequestError('Ocorrência não encontrada')
        }
      }

      const rotinaToSave = repository.rotinaTarefas.create({
        descricao: dto.descricao,
        tarefas: dto.tarefas.map((tarefa) => ({
          tipo: tarefa.tipo,
          ocorrencia: {
            id: tarefa.ocorrenciaId,
          },
          createdBy: membership.user.id,
          updatedBy: membership.user.id,
          organizationId: membership.organization.id,
        })),
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      const rotina = await manager.save(rotinaToSave)

      return rotina
    })
  },
}
