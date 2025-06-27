import { hash } from 'bcryptjs'

import { Member } from '@/domain/entities/Member'
import { User } from '@/domain/entities/User'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateUserDTO } from '@/http/routes/user/update-user'

export const updateUserUseCase = {
  async execute(
    id: string,
    dto: UpdateUserDTO,
    membership: Member,
  ): Promise<User> {
    return repository.user.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id },
        select: ['id', 'email'],
      })

      if (!user) {
        throw new BadRequestError('Usuário não encontrado')
      }

      if (dto.email !== user.email) {
        const existingUser = await manager.findOne(User, {
          where: { email: dto.email },
          withDeleted: true,
          select: ['id', 'name', 'deletedAt'],
        })

        if (existingUser) {
          throw new BadRequestError(
            existingUser.deletedAt
              ? `Usuário "${existingUser.name}" desativado`
              : `Usuário "${existingUser.name}" já cadastrado`,
          )
        }
      }

      const passwordHash = dto.password
        ? await hash(dto.password, 6)
        : undefined

      manager.merge(User, user, {
        name: dto.name,
        email: dto.email,
        ...(passwordHash && { password: passwordHash }),
        avatarUrl: dto.avatarUrl,
        updatedBy: membership.user.id,
      })

      if (dto.role) {
        await manager.update(
          Member,
          {
            user: { id },
            organization: { id: membership.organization.id },
          },
          { role: dto.role },
        )
      }

      return manager.save(user)
    })
  },
}
