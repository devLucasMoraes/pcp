import { Organization } from '@/domain/entities/Organization'
import { Role } from '@/domain/entities/Role'
import { User, UserType } from '@/domain/entities/User'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateOrganizationDto } from '@/http/routes/orgs/create-organization'
import { createSlug } from '@/utils/create-slug'

export const createOrganizationUseCase = {
  async execute(
    dto: CreateOrganizationDto,
    userId: string,
  ): Promise<Organization> {
    return repository.organization.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        select: ['id', 'userType'],
      })

      if (!user) {
        throw new BadRequestError('Usuário não encontrado')
      }

      if (user.userType === UserType.ORGANIZATIONAL) {
        throw new BadRequestError('Você não pode criar organizações')
      }

      const org = repository.organization.create({
        name: dto.name,
        slug: createSlug(dto.name),
        ownerId: userId,
        owner: { id: userId },
        createdBy: userId,
        updatedBy: userId,
      })

      await manager.save(org)

      const member = repository.member.create({
        user: { id: userId },
        role: Role.ADMIN,
        organization: org,
      })

      await manager.save(member)

      return org
    })
  },
}
