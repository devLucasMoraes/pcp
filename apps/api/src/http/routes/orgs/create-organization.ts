import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createOrganizationUseCase } from '@/domain/useCases/organization/CreateOrganizationUseCase'
import { auth } from '@/http/middleware/auth'

const bodySchema = z.object({
  name: z.string(),
})

export type CreateOrganizationDto = z.infer<typeof bodySchema>

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'create new organization',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          response: {
            201: z.object({
              organizationId: z.string(),
              slug: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const userId = await req.getCurrentUserId()

        const { name } = req.body

        const organization = await createOrganizationUseCase.execute(
          { name },
          userId,
        )

        app.io.in(organization.slug).emit('invalidateOrganizationCache', {
          operation: 'create',
          orgSlug: organization.slug,
          organizationId: organization.id,
        })

        return res
          .status(201)
          .send({ organizationId: organization.id, slug: organization.slug })
      },
    )
}
