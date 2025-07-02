import { api } from '../api/axios'

export async function disableOperador(operadorId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/operadores/${operadorId}`)
}
