import cors from 'cors'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const app = express()
const server = http.createServer(app)
const prisma = new PrismaClient()

app.use(cors())
app.use(bodyParser.json())

app.post('/hook', async (req) => {
  const event = req.body

  logger.info('Received clerk event', event)

  switch (event.type) {
    case 'user.created':
    case 'user.updated':
      const user = event.data

      try {
        const res = await prisma.user.upsert({
          where: {
            id: user.id,
          },
          create: {
            id: user.id,
            username: user.username,
            profileImageUrl: user.image_url,
          },
          update: {
            id: user.id,
            username: user.username,
            profileImageUrl: user.image_url,
          },
        })
        logger.info('Created or updated user in database', { id: res.id })
        logger.debug('Created or updated user', res)
      } catch (error) {
        logger.error('Error while creating or updating user in database', error)
      }

      break
    case 'user.deleted':
      if (!event.data.deleted) {
        return
      }

      const userId = event.data.id

      try {
        const res = await prisma.user.delete({
          where: {
            id: userId,
          },
        })
        logger.info('Deleted user in database', { id: res.id })
        logger.debug('Deleted user', res)
      } catch (error) {
        // catch error thrown when user does not exist
        if (error.code === 'P2025') {
          logger.warn(
            'Trying to delete an user that does not exist in database',
          )
          return
        }

        logger.warn('Could not delete user in database', error)
      }
  }
})

server.listen(4000)
