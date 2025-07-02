import { api } from '../api/axios'

export async function disableOcorrencia(ocorrenciaId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/ocorrencias/${ocorrenciaId}`)
}
