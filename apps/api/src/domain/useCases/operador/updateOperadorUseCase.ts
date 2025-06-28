import { Member } from '@/domain/entities/Member'
import { Operador } from '@/domain/entities/Operador'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateOperadorDTO } from '@/http/routes/operador/update-operador'

export const updateOperadorUseCase = {
  async execute(
    id: string,
    dto: UpdateOperadorDTO,
    membership: Member,
  ): Promise<Operador> {
    return repository.operador.manager.transaction(async (manager) => {
      const existingOperador = await manager.findOne(Operador, {
        where: { id },
        select: ['id', 'nome'],
      })

      if (!existingOperador) {
        throw new BadRequestError('Operador não encontrado')
      }

      if (dto.nome !== existingOperador.nome) {
        const existingUser = await manager.findOne(Operador, {
          where: {
            nome: dto.nome,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'nome', 'deletedAt'],
        })

        if (existingUser) {
          throw new BadRequestError(
            existingUser.deletedAt
              ? `Operador "${existingUser.nome}" desativado`
              : `Operador "${existingUser.nome}" já cadastrado`,
          )
        }
      }

      manager.merge(Operador, existingOperador, {
        nome: dto.nome,
        updatedBy: membership.user.id,
      })

      return manager.save(existingOperador)
    })
  },
}
