import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'

import { BadRequestError } from '../../_errors/bad-request-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function refreshToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/refresh',
    {
      schema: {
        tags: ['auth'],
        summary: 'Refresh access token using refresh token',
        response: {
          200: z.object({
            accessToken: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token not found')
      }

      try {
        const { sub, type } = await req.jwtVerify<{
          sub: string
          type: string
        }>({
          onlyCookie: true,
        })

        if (type !== 'refresh') {
          throw new UnauthorizedError('Invalid token type')
        }

        const user = await repository.user.findOne({
          where: {
            id: sub,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found')
        }

        // Gerar novo access token
        const newAccessToken = await res.jwtSign(
          {
            sub: user.id,
            type: 'access',
          },
          {
            sign: {
              expiresIn: '15m',
            },
          },
        )

        // Gerar novo refresh token (rotação)
        const newRefreshToken = await res.jwtSign(
          {
            sub: user.id,
            type: 'refresh',
          },
          {
            sign: {
              expiresIn: '7d',
            },
          },
        )

        // Atualizar cookie
        res.setCookie('refreshToken', newRefreshToken, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60,
        })

        return res.send({ accessToken: newAccessToken })
      } catch (error) {
        console.log(error)
        throw new UnauthorizedError('Invalid or expired refresh token')
      }
    },
  )
}
