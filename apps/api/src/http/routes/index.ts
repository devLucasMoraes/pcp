import { FastifyInstance } from 'fastify'

import authRoutes from './auth'
import equipamentoRoutes from './equipamento'
import ocorrenciaRoutes from './ocorrencia'
import operadorRoutes from './operador'
import ordemProducaoRoutes from './ordem-producao'
import orgsRoutes from './orgs'
import rotinaRoutes from './rotina-tarefas'
import userRoutes from './user'

export default async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/api/v1' })
  app.register(orgsRoutes, { prefix: '/api/v1' })
  app.register(userRoutes, { prefix: '/api/v1' })
  app.register(ocorrenciaRoutes, { prefix: '/api/v1' })
  app.register(operadorRoutes, { prefix: '/api/v1' })
  app.register(rotinaRoutes, { prefix: '/api/v1' })
  app.register(equipamentoRoutes, { prefix: '/api/v1' })
  app.register(ordemProducaoRoutes, { prefix: '/api/v1' })
}
