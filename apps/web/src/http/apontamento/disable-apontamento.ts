import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { disableApontamentoUseCase } from '@/domain/useCases/apontamento/disableApontamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function disableApontamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/apontamentos/:apontamentoId',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Desativa um apontamento por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            apontamentoId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { orgSlug, apontamentoId } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('disable', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await disableApontamentoUseCase.execute(apontamentoId, membership)

        app.io.in(orgSlug).emit('invalidateApontamentoCache', {
          operation: 'disable',
          orgSlug,
          apontamentoId,
        })

        return res.status(204).send()
      },
    )
}
