import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateOperadorUseCase } from '@/domain/useCases/operador/updateOperadorUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
})

export type UpdateOperadorDTO = z.infer<typeof bodySchema>

export async function updateOperador(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/operadores/:operadorId',
      {
        schema: {
          tags: ['operadores'],
          summary: 'Atualiza um operador por id',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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
        const { orgSlug } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('update', 'Operador')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateOperadorDTO = req.body

        const { operadorId } = req.params

        await updateOperadorUseCase.execute(
          operadorId,
          updateOperadorDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateOperadorCache', {
          operation: 'update',
          orgSlug,
          operadorId,
        })

        return res.status(204).send()
      },
    )
}
