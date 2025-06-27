import { Member } from '@/domain/entities/Member'
import { Organization } from '@/domain/entities/Organization'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const deleteOrganizationUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.organization.manager.transaction(async (manager) => {
      const organization = await manager.findOne(Organization, {
        where: { id },
        select: ['id', 'deletedAt'],
        withDeleted: true,
      })

      if (!organization) {
        throw new BadRequestError('Organização não encontrada')
      }

      if (organization.deletedAt) {
        throw new BadRequestError('Organização já está desativada')
      }

      await manager.update(Organization, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Organization, id)
    })
  },
}
