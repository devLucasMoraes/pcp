import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { disableOperadorUseCase } from '@/domain/useCases/operador/disableOperadorUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function disableOperador(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/operadores/:operadorId',
      {
        schema: {
          tags: ['operadores'],
          summary: 'Desativa um operador por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            operadorId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { orgSlug, operadorId } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('disable', 'Operador')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await disableOperadorUseCase.execute(operadorId, membership)

        app.io.in(orgSlug).emit('invalidateOperadorCache', {
          operation: 'disable',
          orgSlug,
          operadorId,
        })

        return res.status(204).send()
      },
    )
}
