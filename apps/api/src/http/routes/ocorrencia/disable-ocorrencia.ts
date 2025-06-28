import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { disableOcorrenciaUseCase } from '@/domain/useCases/ocorrencia/disableOcorrenciaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function disableOcorrencia(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/ocorrencias/:ocorrenciaId',
      {
        schema: {
          tags: ['ocorrencias'],
          summary: 'Desativa uma ocorrência por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            ocorrenciaId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { orgSlug, ocorrenciaId } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('disable', 'Ocorrencia')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await disableOcorrenciaUseCase.execute(ocorrenciaId, membership)

        app.io.in(orgSlug).emit('invalidateOcorrenciaCache', {
          operation: 'disable',
          orgSlug,
          ocorrenciaId,
        })

        return res.status(204).send()
      },
    )
}
