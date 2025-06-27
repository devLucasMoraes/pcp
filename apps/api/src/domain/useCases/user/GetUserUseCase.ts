import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { User } from '../../entities/User'

export const getUserUseCase = {
  async execute(id: string): Promise<User> {
    const user = await repository.user.findOneBy({ id })

    if (!user) {
      throw new BadRequestError('Usuário não encontrado')
    }

    return user
  },
}
