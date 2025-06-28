import { FastifyInstance } from 'fastify'

import authRoutes from './auth'
import ocorrenciaRoutes from './ocorrencia'
import orgsRoutes from './orgs'
import userRoutes from './user'

export default async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/api/v1' })
  app.register(orgsRoutes, { prefix: '/api/v1' })
  app.register(userRoutes, { prefix: '/api/v1' })
  app.register(ocorrenciaRoutes, { prefix: '/api/v1' })
}
