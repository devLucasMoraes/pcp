import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { repository } from '@/domain/repositories'

import { ForbiddenError } from '../_errors/Forbidden-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

async function addUserToOrganizationRoom(
  app: FastifyInstance,
  userId: string,
  orgSlug: string,
) {
  try {
    // Buscar todos os sockets conectados
    const sockets = await app.io.fetchSockets()
    console.log({ sockets })

    // Filtrar sockets do usuário específico
    const userSockets = sockets.filter((socket) => socket.userId === userId)

    // Adicionar cada socket do usuário à sala da organização
    userSockets.forEach((socket) => {
      if (!socket.rooms.has(orgSlug)) {
        socket.join(orgSlug)
        app.log.info(`Socket ${socket.id} adicionado a sala: ${orgSlug}`)
      }
    })
  } catch (error) {
    app.log.error(
      `Erro ao adicionar usuário ${userId} a sala ${orgSlug}:`,
      error,
    )
  }
}

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    req.getCurrentUserId = async () => {
      try {
        const { sub, type } = await req.jwtVerify<{
          sub: string
          type: string
        }>()

        if (type !== 'access') {
          throw new UnauthorizedError('Invalid token type')
        }

        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }

    req.getUserMembership = async (slug: string) => {
      const userId = await req.getCurrentUserId()

      const member = await repository.member
        .createQueryBuilder('member')
        .innerJoinAndSelect('member.user', 'user')
        .innerJoinAndSelect('member.organization', 'organization')
        .where('user.id = :userId', { userId })
        .andWhere('organization.slug = :slug', { slug })
        .getOne()

      if (!member) {
        throw new ForbiddenError('Você não faz parte dessa organização')
      }

      console.log({ member })

      const { organization } = member

      await addUserToOrganizationRoom(app, userId, organization.slug)

      return {
        membership: member,
        organization,
      }
    }
  })
})
