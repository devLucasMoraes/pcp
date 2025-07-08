import { api } from '../api/axios'

export interface GetTotaisProducaoResponse {
  tempoProdutivo: number
  tempoImprodutivo: number
  tempoIntervalo: number
  tempoPreparacao: number
  tempoTotal: number
  qtdeTotal: number
}

export async function getTotaisProducao(
  orgSlug: string,
  equipamentoId: string,
  dataInicio: Date,
  dataFim: Date,
) {
  const response = await api.get<GetTotaisProducaoResponse>(
    `/organizations/${orgSlug}/apontamentos/totais-producao`,
    {
      params: {
        equipamentoId,
        dataInicio,
        dataFim,
      },
    },
  )
  return response.data
}
