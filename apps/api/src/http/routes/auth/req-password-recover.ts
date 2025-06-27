import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { TokenType } from '@/domain/entities/TokenType'
import { repository } from '@/domain/repositories'

export async function reqPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: '',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (req, res) => {
      const { email } = req.body

      const userFromEmail = await repository.user.findOne({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        // We don´t want people to know if the email doesn't exist
        return res.status(201).send()
      }

      const tokenData = repository.token.create({
        type: TokenType.PASSWORD_RECOVER,
        user: userFromEmail,
      })

      await repository.token.save(tokenData)

      return res.status(201).send()
    },
  )
}
