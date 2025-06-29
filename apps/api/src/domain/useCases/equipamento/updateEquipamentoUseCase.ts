import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateEquipamentoDTO } from '@/http/routes/equipamento/update-equipamento'

export const updateEquipamentoUseCase = {
  async execute(
    id: string,
    dto: UpdateEquipamentoDTO,
    membership: Member,
  ): Promise<Equipamento> {
    return repository.equipamento.manager.transaction(async (manager) => {
      const existingEquipamento = await manager.findOne(Equipamento, {
        where: { id },
        select: ['id', 'nome'],
      })

      if (!existingEquipamento) {
        throw new BadRequestError('Equipamento não encontrado')
      }

      if (dto.nome !== existingEquipamento.nome) {
        const equipamentoComMesmoNome = await manager.findOne(Equipamento, {
          where: {
            nome: dto.nome,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'nome', 'deletedAt'],
        })

        if (equipamentoComMesmoNome) {
          throw new BadRequestError(
            equipamentoComMesmoNome.deletedAt
              ? `Equipamento "${equipamentoComMesmoNome.nome}" desativado`
              : `Equipamento "${equipamentoComMesmoNome.nome}" já cadastrado`,
          )
        }
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

      manager.merge(Equipamento, existingEquipamento, {
        nome: dto.nome,
        rotinaTarefas: { id: dto.rotinaTarefasId },
        updatedBy: membership.user.id,
      })

      return manager.save(existingEquipamento)
    })
  },
}
