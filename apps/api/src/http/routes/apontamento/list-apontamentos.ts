import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { listApontamentosUseCase } from '@/domain/useCases/apontamento/listApontamentosUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function listApontamentos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/apontamentos/list',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Lista paginada de apontamentos',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          querystring: z
            .object({
              page: z.coerce.number().optional(),
              size: z.coerce.number().optional(),
              sort: z.union([z.string(), z.array(z.string())]).optional(),
            })
            .optional(),
          response: {
            200: z.object({
              content: z.array(
                z.object({
                  id: z.string().uuid(),
                  dataIncio: z.date(),
                  dataFim: z.date(),
                  duracao: z.coerce.number(),
                  qtdeApontada: z.coerce.number(),
                  ocorrencia: z.object({
                    id: z.string().uuid(),
                    descricao: z.string(),
                  }),
                  operador: z.object({
                    id: z.string().uuid(),
                    nome: z.string(),
                  }),
                  equipamento: z.object({
                    id: z.string().uuid(),
                    nome: z.string(),
                  }),
                  ordemProducao: z.object({
                    id: z.string().uuid(),
                    cod: z.string(),
                    descricao: z.string(),
                    tiragem: z.coerce.number(),
                    valorServico: z.coerce.number(),
                    nomeCliente: z.string(),
                  }),
                }),
              ),
              totalPages: z.number(),
              totalElements: z.number(),
              size: z.number(),
              number: z.number(),
              numberOfElements: z.number(),
              empty: z.boolean(),
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

        if (cannot('get', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listApontamentosUseCase.execute(
          membership,
          pageRequest,
        )

        return res.status(200).send(result)
      },
    )
}
