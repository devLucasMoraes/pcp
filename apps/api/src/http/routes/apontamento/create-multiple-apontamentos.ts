import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createMultipleApontamentosUseCase } from '@/domain/useCases/apontamento/createMultipleApontamentosUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const apontamentoSchema = z.object({
  dataInicio: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), 'Data inválida'),
  dataFim: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), 'Data inválida'),
  qtdeApontada: z.coerce.number(),
  ocorrenciaId: z.string().uuid(),
  operadorId: z.string().uuid(),
  equipamentoId: z.string().uuid(),
  ordemProducao: z.object({
    cod: z.string(),
    descricao: z.string(),
    tiragem: z.number(),
    valorServico: z.number(),
    nomeCliente: z.string(),
  }),
})

const bodySchema = z.object({
  apontamentos: z
    .array(apontamentoSchema)
    .min(1, 'Deve conter pelo menos um apontamento'),
})

export type CreateMultipleApontamentosDTO = z.infer<typeof bodySchema>

export async function createMultipleApontamentos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/apontamentos/bulk',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Cria múltiplos apontamentos',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              apontamentos: z.array(
                z.object({
                  id: z.string(),
                }),
              ),
              totalCreated: z.number(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createMultipleApontamentosDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const apontamentos = await createMultipleApontamentosUseCase.execute(
          createMultipleApontamentosDTO,
          membership,
        )

        // Emitir evento para invalidar cache
        app.io.in(slug).emit('invalidateApontamentoCache', {
          operation: 'bulkCreate',
          orgSlug: slug,
          apontamentoIds: apontamentos.map((a) => a.id),
          totalCreated: apontamentos.length,
        })

        return res.status(201).send({
          apontamentos: apontamentos.map((a) => ({ id: a.id })),
          totalCreated: apontamentos.length,
        })
      },
    )
}
