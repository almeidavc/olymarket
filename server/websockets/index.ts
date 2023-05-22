import { Server } from 'socket.io'
import { server } from '../app'
import {
  getSocketIdByUserId,
  registerConnection,
  removeConnection,
} from './connections'
import jwt from 'jsonwebtoken'
import { Message } from '@prisma/client'
import { prisma } from 'db'

type MessageInput = Pick<
  Message,
  'from' | 'to' | 'content' | 'createdAt' | 'conversationId'
>

interface ClientToServerEvents {
  'message:send': (
    payload: { message: MessageInput },
    acknowledge: (response: { message: Message }) => void
  ) => void
  authenticate
}

interface ServerToClientEvents {
  'message:receive': (payload: { message: Message }) => void
  authenticated
  unauthorized
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server)

io.on('connection', (socket) => {
  socket.on('authenticate', ({ token }) => {
    try {
      const decoded = jwt.verify(token, process.env.CLERK_JWT_PUBLIC_KEY)
      registerConnection(socket.id, decoded.sub)
      socket.emit('authenticated')
    } catch {
      socket.emit('unauthorized')
      socket.disconnect()
    }
  })
  socket.on('disconnect', () => {
    removeConnection(socket.id)
  })

  socket.on('message:send', async (payload, acknowledge) => {
    const message = await prisma.message.create({
      data: {
        ...payload.message,
      },
    })

    acknowledge({ message })

    // emit message to the other chat participant
    const receiverSocket = getSocketIdByUserId(message.to)
    if (receiverSocket) {
      io.to(receiverSocket).emit('message:receive', { message })
    }
  })
})
