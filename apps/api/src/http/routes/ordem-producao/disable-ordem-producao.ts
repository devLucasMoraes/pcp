import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { disableOrdemProducaoUseCase } from '@/domain/useCases/ordem-producao/disableOrdemProducaoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function disableOrdemProducao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/ordens-producao/:ordemProducaoId',
      {
        schema: {
          tags: ['ordens-producao'],
          summary: 'Desativa um ordem producao por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            ordemProducaoId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { orgSlug, ordemProducaoId } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('disable', 'OrdemProducao')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await disableOrdemProducaoUseCase.execute(ordemProducaoId, membership)

        app.io.in(orgSlug).emit('invalidateOrdemProducaoCache', {
          operation: 'disable',
          orgSlug,
          ordemProducaoId,
        })

        return res.status(204).send()
      },
    )
}
