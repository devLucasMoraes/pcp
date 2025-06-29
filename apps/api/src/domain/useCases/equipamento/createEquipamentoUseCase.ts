import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateEquipamentoDTO } from '@/http/routes/equipamento/create-equipamento'

export const createEquipamentoUseCase = {
  async execute(
    dto: CreateEquipamentoDTO,
    membership: Member,
  ): Promise<Equipamento> {
    return repository.equipamento.manager.transaction(async (manager) => {
      const existingEquipamento = await manager.findOne(Equipamento, {
        where: {
          nome: dto.nome,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'nome', 'deletedAt'],
      })

      if (existingEquipamento) {
        throw new BadRequestError(
          existingEquipamento.deletedAt
            ? `Equipamento "${existingEquipamento.nome}" desativado`
            : `Equipamento "${existingEquipamento.nome}" já cadastrado`,
        )
      }

      const existingRotinaTarefas = await manager.findOne(RotinaTarefas, {
        where: {
          id: dto.rotinaTarefasId,
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      if (!existingRotinaTarefas) {
        throw new BadRequestError('Rotina de tarefas não encontrada')
      }

      const equipamentoToSave = repository.equipamento.create({
        nome: dto.nome,
        rotinaTarefas: { id: dto.rotinaTarefasId },
        organizationId: membership.organization.id,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
      })

      const equipamento = await manager.save(equipamentoToSave)

      return equipamento
    })
  },
}
