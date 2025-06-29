import { Equipamento } from '@/domain/entities/Equipamento'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getEquipamentoUseCase = {
  async execute(id: string): Promise<Equipamento> {
    const equipamento = await repository.equipamento.findOne({
      where: {
        id,
      },
      relations: {
        rotinaTarefas: true,
      },
    })

    if (!equipamento) {
      throw new BadRequestError('Equipamento não encontrado')
    }

    return equipamento
  },
}
