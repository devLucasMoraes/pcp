import { api } from '../api/axios'

export async function disableOrdemProducao(
  ordemProducaoId: string,
  orgSlug: string,
) {
  await api.delete(
    `/organizations/${orgSlug}/ordens-producao/${ordemProducaoId}`,
  )
}
