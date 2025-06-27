import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserType } from '@/domain/entities/User'
import { repository } from '@/domain/repositories'

import { BadRequestError } from '../../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sign-up',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new user',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (req, res) => {
      const { name, email, password } = req.body
      const userWithSameEmail = await repository.user.findOne({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        throw new BadRequestError(
          'User with this email already exists, please login',
        )
      }

      const passwordHash = await hash(password, 6)

      const userData = repository.user.create({
        name,
        email,
        password: passwordHash,
        userType: UserType.MASTER,
      })

      await repository.user.save(userData)

      return res.status(201).send({
        message: 'User created successfully',
      })
    },
  )
}
