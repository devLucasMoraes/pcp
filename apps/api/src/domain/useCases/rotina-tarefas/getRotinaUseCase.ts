import { RotinaTarefas } from '@/domain/entities/RotinaTarefas'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getRotinaUseCase = {
  async execute(id: string): Promise<RotinaTarefas> {
    const rotina = await repository.rotinaTarefas.findOneBy({ id })

    if (!rotina) {
      throw new BadRequestError('Rotina não encontrada')
    }

    return rotina
  },
}
