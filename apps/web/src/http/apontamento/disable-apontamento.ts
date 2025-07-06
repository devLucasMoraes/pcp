import { api } from '../api/axios'

export async function disableApontamento(
  apontamentoId: string,
  orgSlug: string,
) {
  await api.delete(`/organizations/${orgSlug}/apontamentos/${apontamentoId}`)
}
