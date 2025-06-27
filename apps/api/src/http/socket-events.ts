import { FastifyInstance } from 'fastify'

export function setupSocketEvents(app: FastifyInstance) {
  app.io.on('connection', (socket) => {
    app.log.info(`Cliente conectado, userId: ${socket.userId}`)

    socket.on('disconnect', () => {
      app.log.info(`Cliente desconectado, socketId: ${socket.id}`)
    })
  })
}
