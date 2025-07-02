import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getOperadorUseCase } from '@/domain/useCases/operador/getOperadorUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getOperador(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/operadores/:operadorId',
      {
        schema: {
          tags: ['operadores'],
          summary: 'Retorna um operador por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            operadorId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              nome: z.string(),
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

        if (cannot('get', 'Operador')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const { operadorId } = req.params

        const operador = await getOperadorUseCase.execute(operadorId)

        return res.status(201).send(operador)
      },
    )
}
