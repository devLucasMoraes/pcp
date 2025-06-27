import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: '',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (req, res) => {
      const { code, password } = req.body

      const tokenFromCode = await repository.token.findOne({
        where: { id: code },
        relations: {
          user: true,
        },
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError('Invalid code')
      }

      const passwordHash = await hash(password, 6)

      await repository.user.update(
        { id: tokenFromCode.user.id },
        {
          password: passwordHash,
        },
      )

      return res.status(204).send()
    },
  )
}
