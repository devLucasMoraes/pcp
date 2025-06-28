import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createOcorrenciaUseCase } from '@/domain/useCases/ocorrencia/createOcorrenciaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  descricao: z.string(),
  cor: z.string(),
})

export type CreateOcorrenciaDTO = z.infer<typeof bodySchema>

export async function createOcorrencia(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/ocorrencias',
      {
        schema: {
          tags: ['ocorrencias'],
          summary: 'Cria uma nova ocorrência',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              ocorrenciaId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createOcorrenciaDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Ocorrencia')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const ocorrencia = await createOcorrenciaUseCase.execute(
          createOcorrenciaDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateOcorrenciaCache', {
          operation: 'create',
          orgSlug: slug,
          ocorrenciaId: ocorrencia.id,
        })

        return res.status(201).send({ ocorrenciaId: ocorrencia.id })
      },
    )
}
