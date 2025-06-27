import { api } from '../api/axios'

export async function shtutdownOrganization(orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}`)
}
