import { Between } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { TarefaTipo } from '@/domain/entities/TarefaTipo'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getTotaisProducaoUseCase = {
  async execute(
    membership: Member,
    equipamentoId: string,
    periodoInicio: Date,
    periodoFim: Date,
  ) {
    // Obtém o equipamento com sua rotina de tarefas
    const equipamento = await repository.equipamento.findOne({
      where: {
        id: equipamentoId,
        organizationId: membership.organization.id,
      },
      relations: {
        rotinaTarefas: {
          tarefas: {
            ocorrencia: true,
          },
        },
      },
    })

    if (!equipamento) {
      throw new BadRequestError('Equipamento não encontrado')
    }

    // Cria mapa de ocorrência para tipo (usando a rotina do equipamento)
    const ocorrenciaTipoMap = new Map<string, TarefaTipo>()

    equipamento.rotinaTarefas?.tarefas?.forEach((tarefa) => {
      if (tarefa.ocorrencia) {
        ocorrenciaTipoMap.set(tarefa.ocorrencia.id, tarefa.tipo)
      }
    })

    // Busca os apontamentos
    const apontamentos = await repository.apontamento.find({
      where: {
        organizationId: membership.organization.id,
        equipamento: { id: equipamentoId },
        dataInicio: Between(periodoInicio, periodoFim),
      },
      relations: {
        ocorrencia: true,
      },
    })

    console.log({ apontamentos })

    // Inicializa acumuladores
    let tempoPreparacao = 0
    let tempoProdutivo = 0
    let tempoImprodutivo = 0
    let tempoIntervalo = 0
    let qtdeTotal = 0

    // Processa cada apontamento
    apontamentos.forEach((ap) => {
      const duracao = Number(ap.duracao)
      const qtde = Number(ap.qtdeApontada)
      const ocorrenciaId = ap.ocorrencia.id

      qtdeTotal += qtde

      // Obtém tipo da ocorrência a partir do mapa
      const tipo = ocorrenciaTipoMap.get(ocorrenciaId)

      // Classifica conforme o tipo
      switch (tipo) {
        case TarefaTipo.PRODUTIVO:
          tempoProdutivo += duracao
          break
        case TarefaTipo.IMPRODUTIVO:
          tempoImprodutivo += duracao
          break
        case TarefaTipo.INTERVALO:
          tempoIntervalo += duracao
          break
        case TarefaTipo.PREPARACAO:
          tempoPreparacao += duracao
          break
        // Intervalo é ignorado
      }
    })

    return {
      tempoPreparacao,
      tempoProdutivo,
      tempoImprodutivo,
      tempoIntervalo,
      tempoTotal: tempoProdutivo + tempoImprodutivo + tempoPreparacao,
      qtdeTotal,
    }
  },
}
