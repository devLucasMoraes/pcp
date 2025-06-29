import { In } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { Tarefa } from '@/domain/entities/Tarefa'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateRotinaDTO } from '@/http/routes/rotina-tarefas/update-ocorrencia'

export const updateRotinaUseCase = {
  async execute(
    id: string,
    dto: UpdateRotinaDTO,
    membership: Member,
  ): Promise<RotinaTarefas> {
    return repository.rotinaTarefas.manager.transaction(async (manager) => {
      const existingRotina = await manager.findOne(RotinaTarefas, {
        where: { id },
        relations: ['tarefas'],
        select: {
          id: true,
          descricao: true,
          tarefas: { id: true },
        },
      })

      if (!existingRotina) {
        throw new BadRequestError('Rotina não encontrada')
      }

      if (dto.tarefas.length === 0) {
        throw new BadRequestError(
          'Rotina de tarefas precisa ter pelo menos uma tarefa',
        )
      }

      if (dto.descricao !== existingRotina.descricao) {
        const rotinaComMesmaDescricao = await manager.findOne(RotinaTarefas, {
          where: {
            descricao: dto.descricao,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'descricao', 'deletedAt'],
        })

        if (rotinaComMesmaDescricao) {
          throw new BadRequestError(
            rotinaComMesmaDescricao.deletedAt
              ? `Rotina "${rotinaComMesmaDescricao.descricao}" desativada`
              : `Rotina "${rotinaComMesmaDescricao.descricao}" já cadastrada`,
          )
        }
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

        if (tarefa.id) {
          const existingTarefa = existingRotina.tarefas.some(
            (item) => item.id === tarefa.id,
          )
          if (!existingTarefa) {
            throw new BadRequestError(
              `Tarefa ${tarefa.id} nao pertence a rotina`,
            )
          }
        }
      }

      const tarefasIdsNoDTO = dto.tarefas
        .filter((tarefa) => tarefa.id)
        .map((tarefa) => tarefa.id)

      const tarefasOrfas = existingRotina.tarefas.filter(
        (tarefaExistente) => !tarefasIdsNoDTO.includes(tarefaExistente.id),
      )

      if (tarefasOrfas.length > 0) {
        await manager.update(
          Tarefa,
          {
            id: In(tarefasOrfas.map((tarefa) => tarefa.id)),
          },
          {
            deletedBy: membership.user.id,
            deletedAt: new Date(),
          },
        )
      }

      const rotinaToUpdate = repository.rotinaTarefas.merge(
        { id: existingRotina.id } as RotinaTarefas,
        {
          descricao: dto.descricao,
          updatedBy: membership.user.id,
          tarefas: dto.tarefas.map((tarefa) => ({
            id: tarefa.id || undefined,
            tipo: tarefa.tipo,
            ocorrencia: {
              id: tarefa.ocorrenciaId,
            },
            createdBy: tarefa.id ? undefined : membership.user.id,
            updatedBy: membership.user.id,
            organizationId: membership.organization.id,
          })),
        },
      )

      return manager.save(RotinaTarefas, rotinaToUpdate)
    })
  },
}
