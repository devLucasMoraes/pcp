import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllOcorrenciaUseCase } from '@/domain/useCases/ocorrencia/getAllOcorrenciaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAllOcorrencias(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/ocorrencias',
      {
        schema: {
          tags: ['ocorrencias'],
          summary: 'Lista todas as ocorrências',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                descricao: z.string(),
                cor: z.string(),
              }),
            ),
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

        if (cannot('get', 'Ocorrencia')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const ocorrencias = await getAllOcorrenciaUseCase.execute(membership)

        return res.status(200).send(ocorrencias)
      },
    )
}
