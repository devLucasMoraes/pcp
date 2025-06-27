import { roleSchema } from '@pcp/authorization'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllOrganizationsUseCase } from '@/domain/useCases/organization/GetAllOrganizationsUseCase'
import { auth } from '@/http/middleware/auth'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'get organizations where user is member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                role: roleSchema,
              }),
            ),
          },
        },
      },
      async (req, res) => {
        const userId = await req.getCurrentUserId()

        const organizations = await getAllOrganizationsUseCase.execute(userId)

        const organizationsWithRole = organizations.map(
          ({ members, ...org }) => {
            return {
              ...org,
              role: members[0].role,
            }
          },
        )

        return res.status(200).send(organizationsWithRole)
      },
    )
}
