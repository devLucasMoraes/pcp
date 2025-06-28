import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getOcorrenciaUseCase } from '@/domain/useCases/ocorrencia/getOcorrenciaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getOcorrencia(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/ocorrencias/:ocorrenciaId',
      {
        schema: {
          tags: ['ocorrencias'],
          summary: 'Retorna uma ocorrência por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            ocorrenciaId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              descricao: z.string(),
              cor: z.string(),
            }),
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

        const { ocorrenciaId } = req.params

        const ocorrencia = await getOcorrenciaUseCase.execute(ocorrenciaId)

        return res.status(201).send(ocorrencia)
      },
    )
}
