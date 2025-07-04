import { api } from '../api/axios'

export async function disableEquipamento(
  equipamentoId: string,
  orgSlug: string,
) {
  await api.delete(`/organizations/${orgSlug}/equipamentos/${equipamentoId}`)
}
