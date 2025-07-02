import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { disableRotinaUseCase } from '@/domain/useCases/rotina-tarefas/disableRotinaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function disableRotina(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/rotinas/:rotinaId',
      {
        schema: {
          tags: ['rotinas'],
          summary: 'Desativa uma rotina de tarefas por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            rotinaId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { orgSlug, rotinaId } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('disable', 'Rotina')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await disableRotinaUseCase.execute(rotinaId, membership)

        app.io.in(orgSlug).emit('invalidateRotinaCache', {
          operation: 'disable',
          orgSlug,
          rotinaId,
        })

        return res.status(204).send()
      },
    )
}
