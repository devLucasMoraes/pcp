import { Member } from '@/domain/entities/Member'
import { Operador } from '@/domain/entities/Operador'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateOperadorDTO } from '@/http/routes/operador/create-operador'

export const createOperadorUseCase = {
  async execute(dto: CreateOperadorDTO, membership: Member): Promise<Operador> {
    return repository.operador.manager.transaction(async (manager) => {
      const existingOperador = await manager.findOne(Operador, {
        where: {
          nome: dto.nome,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'nome', 'deletedAt'],
      })

      if (existingOperador) {
        throw new BadRequestError(
          existingOperador.deletedAt
            ? `Operador "${existingOperador.nome}" desativado`
            : `Operador "${existingOperador.nome}" já cadastrado`,
        )
      }

      const operadorToSave = repository.operador.create({
        nome: dto.nome,
        organizationId: membership.organization.id,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
      })

      const operador = await manager.save(operadorToSave)

      return operador
    })
  },
}
