import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createEquipamentoUseCase } from '@/domain/useCases/equipamento/createEquipamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
  rotinaTarefasId: z.string().uuid(),
})

export type CreateEquipamentoDTO = z.infer<typeof bodySchema>

export async function createEquipamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/equipamentos',
      {
        schema: {
          tags: ['equipamentos'],
          summary: 'Cria uma novo equipamento',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              equipamentoId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createEquipamentoDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Equipamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const equipamento = await createEquipamentoUseCase.execute(
          createEquipamentoDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateEquipamentoCache', {
          operation: 'create',
          orgSlug: slug,
          equipamentoId: equipamento.id,
        })

        return res.status(201).send({ equipamentoId: equipamento.id })
      },
    )
}
