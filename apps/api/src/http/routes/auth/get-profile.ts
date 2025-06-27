import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'
import { auth } from '@/http/middleware/auth'

import { BadRequestError } from '../../_errors/bad-request-error'

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile',
      {
        schema: {
          tags: ['auth'],
          summary: 'Get authenticated user profile',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string().email().nullable(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
          },
        },
      },
      async (req, res) => {
        const userId = await req.getCurrentUserId()

        const user = await repository.user.findOne({
          where: {
            id: userId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found')
        }

        return res.send({ user })
      },
    )
}
