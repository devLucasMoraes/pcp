import { In } from 'typeorm'

import { Apontamento } from '@/domain/entities/Apontamento'
import { Equipamento } from '@/domain/entities/Equipamento'
import { Member } from '@/domain/entities/Member'
import { Ocorrencia } from '@/domain/entities/Ocorrencia'
import { Operador } from '@/domain/entities/Operador'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateMultipleApontamentosDTO } from '@/http/routes/apontamento/create-multiple-apontamentos'
import { calcularDuracaoEmMinutos } from '@/utils/calcular-duracao-em-minutos'

export const createMultipleApontamentosUseCase = {
  async execute(
    dto: CreateMultipleApontamentosDTO,
    membership: Member,
  ): Promise<Apontamento[]> {
    return repository.apontamento.manager.transaction(async (manager) => {
      // Coletamos todos os IDs únicos para validação
      const ocorrenciaIds = [
        ...new Set(dto.apontamentos.map((a) => a.ocorrenciaId)),
      ]
      const operadorIds = [
        ...new Set(dto.apontamentos.map((a) => a.operadorId)),
      ]
      const equipamentoIds = [
        ...new Set(dto.apontamentos.map((a) => a.equipamentoId)),
      ]
      const ordemProducaoIds = [
        ...new Set(dto.apontamentos.map((a) => a.ordemProducaoId)),
      ]

      // Validação em lote das ocorrências usando In() do TypeORM
      const existingOcorrencias = await manager.find(Ocorrencia, {
        where: {
          id: In(ocorrenciaIds),
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      const foundOcorrenciaIds = existingOcorrencias.map((o) => o.id)
      const missingOcorrenciaIds = ocorrenciaIds.filter(
        (id) => !foundOcorrenciaIds.includes(id),
      )

      if (missingOcorrenciaIds.length > 0) {
        throw new BadRequestError(
          `Ocorrências não encontradas: ${missingOcorrenciaIds.join(', ')}`,
        )
      }

      // Validação em lote dos operadores
      const existingOperadores = await manager.find(Operador, {
        where: {
          id: In(operadorIds),
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      const foundOperadorIds = existingOperadores.map((o) => o.id)
      const missingOperadorIds = operadorIds.filter(
        (id) => !foundOperadorIds.includes(id),
      )

      if (missingOperadorIds.length > 0) {
        throw new BadRequestError(
          `Operadores não encontrados: ${missingOperadorIds.join(', ')}`,
        )
      }

      // Validação em lote dos equipamentos
      const existingEquipamentos = await manager.find(Equipamento, {
        where: {
          id: In(equipamentoIds),
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      const foundEquipamentoIds = existingEquipamentos.map((e) => e.id)
      const missingEquipamentoIds = equipamentoIds.filter(
        (id) => !foundEquipamentoIds.includes(id),
      )

      if (missingEquipamentoIds.length > 0) {
        throw new BadRequestError(
          `Equipamentos não encontrados: ${missingEquipamentoIds.join(', ')}`,
        )
      }

      // Validação em lote das ordens de produção
      const existingOrdens = await manager.find(OrdemProducao, {
        where: {
          id: In(ordemProducaoIds),
          organizationId: membership.organization.id,
        },
        select: ['id'],
      })

      const foundOrdemIds = existingOrdens.map((o) => o.id)
      const missingOrdemIds = ordemProducaoIds.filter(
        (id) => !foundOrdemIds.includes(id),
      )

      if (missingOrdemIds.length > 0) {
        throw new BadRequestError(
          `Ordens de produção não encontradas: ${missingOrdemIds.join(', ')}`,
        )
      }

      // Preparar dados para bulk insert otimizado
      const apontamentosData = dto.apontamentos.map((apontamentoData) => {
        const { duracaoMinutos } = calcularDuracaoEmMinutos(
          apontamentoData.dataInicio,
          apontamentoData.dataFim,
        )

        return {
          dataInicio: apontamentoData.dataInicio,
          dataFim: apontamentoData.dataFim,
          duracao: duracaoMinutos,
          qtdeApontada: apontamentoData.qtdeApontada,
          ocorrencia: { id: apontamentoData.ocorrenciaId },
          operador: { id: apontamentoData.operadorId },
          equipamento: { id: apontamentoData.equipamentoId },
          ordemProducao: { id: apontamentoData.ordemProducaoId },
          organizationId: membership.organization.id,
          createdBy: membership.user.id,
          updatedBy: membership.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })

      // Usar insert() para melhor performance em bulk operations
      const insertResult = await manager
        .createQueryBuilder()
        .insert()
        .into(Apontamento)
        .values(apontamentosData)
        .execute()

      // Buscar os registros criados para retornar com os dados completos
      const insertedIds = insertResult.identifiers.map(
        (identifier) => identifier.id,
      )

      const apontamentos = await manager.find(Apontamento, {
        where: {
          id: In(insertedIds),
        },
        relations: {
          equipamento: true,
          ocorrencia: true,
          operador: true,
          ordemProducao: true,
        },
      })

      return apontamentos
    })
  },
}
