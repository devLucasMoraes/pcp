import { api } from '../api/axios'

export async function disableRotina(rotinaId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/rotinas/${rotinaId}`)
}
