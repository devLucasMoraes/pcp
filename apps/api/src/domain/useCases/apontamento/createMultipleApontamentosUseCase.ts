import { EntityManager, In } from 'typeorm'

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
      // Extrair IDs únicos uma única vez
      const uniqueIds = this.extractUniqueIds(dto.apontamentos)

      // Validar existência de ocorrencias, operadores e equipamentos
      const [
        validOcorrencias,
        validOperadores,
        validEquipamentos,
        existingOrdens,
      ] = await Promise.all([
        this.validateOcorrencias(
          manager,
          uniqueIds.ocorrenciaIds,
          membership.organization.id,
        ),
        this.validateOperadores(
          manager,
          uniqueIds.operadorIds,
          membership.organization.id,
        ),
        this.validateEquipamentos(
          manager,
          uniqueIds.equipamentoIds,
          membership.organization.id,
        ),
        this.findExistingOrdens(
          manager,
          uniqueIds.ordemProducaoCods,
          membership.organization.id,
        ),
      ])

      // Criar ordens de produção faltantes
      const codToIdMap = await this.createMissingOrdens(
        manager,
        dto.apontamentos,
        existingOrdens,
        membership,
      )

      // Preparar dados dos apontamentos com validação prévia
      const apontamentosData = this.prepareApontamentosData(
        dto.apontamentos,
        codToIdMap,
        membership,
      )

      // Inserir apontamentos em lote
      const insertResult = await manager
        .createQueryBuilder()
        .insert()
        .into(Apontamento)
        .values(apontamentosData)
        .execute()

      // Retornar apontamentos criados com relacionamentos
      return this.fetchCreatedApontamentos(manager, insertResult.identifiers)
    })
  },

  // Método auxiliar para extrair IDs únicos
  extractUniqueIds(
    apontamentos: CreateMultipleApontamentosDTO['apontamentos'],
  ) {
    const ocorrenciaIds = new Set<string>()
    const operadorIds = new Set<string>()
    const equipamentoIds = new Set<string>()
    const ordemProducaoCods = new Set<string>()

    apontamentos.forEach((ap) => {
      ocorrenciaIds.add(ap.ocorrenciaId)
      operadorIds.add(ap.operadorId)
      equipamentoIds.add(ap.equipamentoId)
      ordemProducaoCods.add(ap.ordemProducao.cod)
    })

    return {
      ocorrenciaIds: Array.from(ocorrenciaIds),
      operadorIds: Array.from(operadorIds),
      equipamentoIds: Array.from(equipamentoIds),
      ordemProducaoCods: Array.from(ordemProducaoCods),
    }
  },

  // Validações assíncronas (implementar conforme necessário)
  async validateOcorrencias(
    manager: EntityManager,
    ids: string[],
    organizationId: string,
  ) {
    const found = await manager.find(Ocorrencia, {
      where: { id: In(ids), organizationId },
      select: ['id'],
    })

    if (found.length !== ids.length) {
      const foundIds = found.map((o) => o.id)
      const missing = ids.filter((id) => !foundIds.includes(id))
      throw new BadRequestError(
        `Ocorrências não encontradas: ${missing.join(', ')}`,
      )
    }

    return found
  },

  async validateOperadores(
    manager: EntityManager,
    ids: string[],
    organizationId: string,
  ) {
    const found = await manager.find(Operador, {
      where: { id: In(ids), organizationId },
      select: ['id'],
    })

    if (found.length !== ids.length) {
      const foundIds = found.map((o) => o.id)
      const missing = ids.filter((id) => !foundIds.includes(id))
      throw new BadRequestError(
        `Operadores não encontrados: ${missing.join(', ')}`,
      )
    }

    return found
  },

  async validateEquipamentos(
    manager: EntityManager,
    ids: string[],
    organizationId: string,
  ) {
    const found = await manager.find(Equipamento, {
      where: { id: In(ids), organizationId },
      select: ['id'],
    })

    if (found.length !== ids.length) {
      const foundIds = found.map((e) => e.id)
      const missing = ids.filter((id) => !foundIds.includes(id))
      throw new BadRequestError(
        `Equipamentos não encontrados: ${missing.join(', ')}`,
      )
    }

    return found
  },

  async findExistingOrdens(
    manager: EntityManager,
    cods: string[],
    organizationId: string,
  ) {
    return manager.find(OrdemProducao, {
      where: { cod: In(cods), organizationId },
      select: ['id', 'cod'],
    })
  },

  async createMissingOrdens(
    manager: EntityManager,
    apontamentos: CreateMultipleApontamentosDTO['apontamentos'],
    existingOrdens: OrdemProducao[],
    membership: Member,
  ) {
    // Criar mapa de códigos existentes
    const codToIdMap = new Map<string, string>()
    existingOrdens.forEach((ordem) => {
      codToIdMap.set(ordem.cod, ordem.id)
    })

    // Identificar códigos únicos faltantes
    const existingCods = new Set(existingOrdens.map((o) => o.cod))
    const missingCods = new Set<string>()
    const ordensDataMap = new Map<string, Partial<OrdemProducao>>()

    // Coletar dados das ordens faltantes (primeira ocorrência de cada código)
    apontamentos.forEach((ap) => {
      const cod = ap.ordemProducao.cod
      if (!existingCods.has(cod) && !missingCods.has(cod)) {
        missingCods.add(cod)
        ordensDataMap.set(cod, {
          descricao: ap.ordemProducao.descricao,
          tiragem: ap.ordemProducao.tiragem,
          valorServico: ap.ordemProducao.valorServico,
          nomeCliente: ap.ordemProducao.nomeCliente,
        })
      }
    })

    // Criar novas ordens em lote usando INSERT
    if (missingCods.size > 0) {
      const now = new Date()
      const newOrdensData = Array.from(missingCods).map((cod) => {
        const data = ordensDataMap.get(cod)
        if (!data)
          throw new BadRequestError(`Dados insuficientes para ordem ${cod}`)

        return {
          cod,
          ...data,
          organizationId: membership.organization.id,
          createdBy: membership.user.id,
          updatedBy: membership.user.id,
          createdAt: now,
          updatedAt: now,
        }
      })

      // INSERT em lote - muito mais eficiente
      const insertResult = await manager
        .createQueryBuilder()
        .insert()
        .into(OrdemProducao)
        .values(newOrdensData)
        .execute()

      // Mapear IDs das ordens criadas
      const createdIds = insertResult.identifiers.map((id) => id.id)
      const createdOrdens = await manager.find(OrdemProducao, {
        where: { id: In(createdIds) },
        select: ['id', 'cod'],
      })

      // Adicionar novas ordens ao mapa
      createdOrdens.forEach((ordem) => {
        codToIdMap.set(ordem.cod, ordem.id)
      })
    }

    return codToIdMap
  },

  prepareApontamentosData(
    apontamentos: CreateMultipleApontamentosDTO['apontamentos'],
    codToIdMap: Map<string, string>,
    membership: Member,
  ) {
    const now = new Date()

    return apontamentos.map((apontamentoData) => {
      const { duracaoMinutos } = calcularDuracaoEmMinutos(
        apontamentoData.dataInicio,
        apontamentoData.dataFim,
      )

      const ordemId = codToIdMap.get(apontamentoData.ordemProducao.cod)
      if (!ordemId) {
        throw new BadRequestError(
          `Ordem de produção ${apontamentoData.ordemProducao.cod} não encontrada`,
        )
      }

      return {
        dataInicio: apontamentoData.dataInicio,
        dataFim: apontamentoData.dataFim,
        duracao: duracaoMinutos,
        qtdeApontada: apontamentoData.qtdeApontada,
        ocorrencia: { id: apontamentoData.ocorrenciaId },
        operador: { id: apontamentoData.operadorId },
        equipamento: { id: apontamentoData.equipamentoId },
        ordemProducao: { id: ordemId },
        organizationId: membership.organization.id,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        createdAt: now,
        updatedAt: now,
      }
    })
  },

  async fetchCreatedApontamentos(manager: EntityManager, identifiers: any[]) {
    const insertedIds = identifiers.map((identifier) => identifier.id)

    return manager.find(Apontamento, {
      where: { id: In(insertedIds) },
      relations: {
        equipamento: true,
        ocorrencia: true,
        operador: true,
        ordemProducao: true,
      },
    })
  },
}
