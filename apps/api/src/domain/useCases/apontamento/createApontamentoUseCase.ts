import { Apontamento } from '@/domain/entities/Apontamento'
import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { Operador } from '@/domain/entities/Operador'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateApontamentoDTO } from '@/http/routes/apontamento/create-apontamento'
import { calcularDuracaoEmMinutos } from '@/utils/calcular-duracao-em-minutos'

export const createApontamentoUseCase = {
  async execute(
    dto: CreateApontamentoDTO,
    membership: Member,
  ): Promise<Apontamento> {
    return repository.apontamento.manager.transaction(async (manager) => {
      const existingOcorrencia = await manager.findOne(Ocorrencia, {
        where: {
          id: dto.ocorrenciaId,
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      if (!existingOcorrencia) {
        throw new BadRequestError('Ocorrência não encontrada')
      }

      const existingOperador = await manager.findOne(Operador, {
        where: {
          id: dto.operadorId,
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      if (!existingOperador) {
        throw new BadRequestError('Operador não encontrado')
      }

      const existingEquipamento = await manager.findOne(Equipamento, {
        where: {
          id: dto.equipamentoId,
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      if (!existingEquipamento) {
        throw new BadRequestError('Equipamento não encontrado')
      }

      const existingOrdem = await manager.findOne(OrdemProducao, {
        where: {
          id: dto.ordemProducaoId,
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      if (!existingOrdem) {
        throw new BadRequestError('Ordem de produção não encontrado')
      }

      const { duracaoMinutos } = calcularDuracaoEmMinutos(
        dto.dataInicio,
        dto.dataFim,
      )

      const apontamentoToSave = repository.apontamento.create({
        dataInicio: dto.dataInicio,
        dataFim: dto.dataFim,
        duracao: duracaoMinutos,
        qtdeApontada: dto.qtdeApontada,
        ocorrencia: { id: dto.ocorrenciaId },
        operador: { id: dto.operadorId },
        equipamento: { id: dto.equipamentoId },
        ordemProducao: { id: dto.ordemProducaoId },
        organizationId: membership.organization.id,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
      })

      const apontamento = await manager.save(apontamentoToSave)

      return apontamento
    })
  },
}
