import { z } from 'zod'

import { api } from '../api/axios'

export const updateOrganizationSchema = z.object({
  name: z.string(),
})

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>

export async function updateOrganization(
  orgSlug: string,
  { name }: UpdateOrganizationDto,
) {
  await api.patch(`/organizations/${orgSlug}`, {
    name,
  })
}
