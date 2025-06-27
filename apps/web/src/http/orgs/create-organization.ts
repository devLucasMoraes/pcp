import { z } from 'zod'

import { api } from '../api/axios'

export const createOrganizationSchema = z.object({
  name: z.string(),
})

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>

export interface CreateOrganizationResponse {
  organizationId: string
  slug: string
}

export async function createOrganization({ name }: CreateOrganizationDto) {
  const result = await api.post<CreateOrganizationResponse>('/organizations', {
    name,
  })
  return result.data
}
