import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'

import { BadRequestError } from '../../_errors/bad-request-error'

export async function authWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate user with password',
        body: z.object({
          email: z.string(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            accessToken: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body

      const userFromEmail = await repository.user.findOne({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        throw new BadRequestError('invalid credentials')
      }

      const isPasswordValid = await compare(password, userFromEmail.password)

      if (!isPasswordValid) {
        throw new BadRequestError('invalid credentials')
      }

      const accessToken = await res.jwtSign(
        {
          sub: userFromEmail.id,
          type: 'access',
        },
        {
          sign: {
            expiresIn: '15m',
          },
        },
      )

      const refreshToken = await res.jwtSign(
        {
          sub: userFromEmail.id,
          type: 'refresh',
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      res.setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
      })

      return res.status(201).send({ accessToken })
    },
  )
}
