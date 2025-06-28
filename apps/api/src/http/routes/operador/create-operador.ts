import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createOperadorUseCase } from '@/domain/useCases/operador/createOperadorUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
})

export type CreateOperadorDTO = z.infer<typeof bodySchema>

export async function createOperador(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/operadores',
      {
        schema: {
          tags: ['operadores'],
          summary: 'Cria um novo operador',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              operadorId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createOperadorDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Operador')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const operador = await createOperadorUseCase.execute(
          createOperadorDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateOperadorCache', {
          operation: 'create',
          orgSlug: slug,
          operadorId: operador.id,
        })

        return res.status(201).send({ operadorId: operador.id })
      },
    )
}
