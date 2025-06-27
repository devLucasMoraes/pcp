import { Member } from '@/domain/entities/Member'
import { Organization } from '@/domain/entities/Organization'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateOrganizationDto } from '@/http/routes/orgs/update-organization'
import { createSlug } from '@/utils/create-slug'

export const updateOrganizationUseCase = {
  async execute(
    id: string,
    dto: UpdateOrganizationDto,
    membership: Member,
  ): Promise<Organization> {
    return repository.user.manager.transaction(async (manager) => {
      const organization = await manager.findOne(Organization, {
        where: { id },
        select: ['id', 'name'],
      })

      if (!organization) {
        throw new BadRequestError('Organização não encontrada')
      }

      manager.merge(Organization, organization, {
        name: dto.name,
        slug: createSlug(dto.name),
        updatedBy: membership.user.id,
      })

      return manager.save(organization)
    })
  },
}
