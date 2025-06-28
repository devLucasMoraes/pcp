import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateOcorrenciaUseCase } from '@/domain/useCases/ocorrencia/updateOcorrenciaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  descricao: z.string(),
  cor: z.string(),
})

export type UpdateOcorrenciaDTO = z.infer<typeof bodySchema>

export async function updateOcorrencia(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/ocorrencias/:ocorrenciaId',
      {
        schema: {
          tags: ['ocorrencias'],
          summary: 'Atualiza uma ocorrência',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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
        const { orgSlug } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('update', 'Ocorrencia')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateOcorrenciaDTO = req.body

        const { ocorrenciaId } = req.params

        await updateOcorrenciaUseCase.execute(
          ocorrenciaId,
          updateOcorrenciaDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateOcorrenciaCache', {
          operation: 'update',
          orgSlug,
          ocorrenciaId,
        })

        return res.status(204).send()
      },
    )
}
