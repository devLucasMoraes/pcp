import { Operador } from '@/domain/entities/Operador'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getOperadorUseCase = {
  async execute(id: string): Promise<Operador> {
    const operador = await repository.operador.findOneBy({ id })

    if (!operador) {
      throw new BadRequestError('Operador não encontrado')
    }

    return operador
  },
}
