import { z } from 'zod'

import { api } from '../api/axios'

const transferOrganizationschema = z.object({
  transferToUserId: z.string().uuid(),
})

export type transferOrganizationDto = z.infer<typeof transferOrganizationschema>

export async function transferOrganization(
  orgSlug: string,
  { transferToUserId }: transferOrganizationDto,
) {
  await api.patch(`/organizations/${orgSlug}/owner`, {
    transferToUserId,
  })
}
