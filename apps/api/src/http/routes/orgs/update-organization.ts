import { organizationSchema } from '@pcp/authorization'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateOrganizationUseCase } from '@/domain/useCases/organization/UpdateOrganizationUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  name: z.string(),
})

export type UpdateOrganizationDto = z.infer<typeof bodySchema>

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'update organization by slug',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const userId = await req.getCurrentUserId()
        const { membership, organization } = await req.getUserMembership(slug)

        const { name } = req.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await updateOrganizationUseCase.execute(
          organization.id,
          { name },
          membership,
        )

        app.io.in(organization.slug).emit('invalidateOrganizationCache', {
          operation: 'update',
          orgSlug: organization.slug,
          organizationId: organization.id,
        })

        return res.status(204).send()
      },
    )
}
