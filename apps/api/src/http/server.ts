import { env } from '@pcp/env-server'

import createApp from './app'
import registerRoutes from './routes'
import { setupSocketEvents } from './socket-events'

async function start() {
  const app = await createApp()

  // Registrar rotas
  await registerRoutes(app)

  // Inicialização
  await app.ready()
  setupSocketEvents(app)

  try {
    await app.listen({
      port: env.SERVER_PORT,
      host: '0.0.0.0',
    })
    console.log(`Server running at http://localhost:${env.SERVER_PORT}`)
    console.log(`Documentation: http://localhost:${env.SERVER_PORT}/docs`)
  } catch (err) {
    console.error(err)
    app.log.error(err)
    process.exit(1)
  }
}

start()
