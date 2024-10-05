import cors from 'cors'
import express from 'express'
import http from 'http'
import { appRouter } from './routers'
import { createContext } from './context'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import * as trpcExpress from '@trpc/server/adapters/express'
import { logger } from '@olymarket/backend-utils'

const app = express()
app.use(cors())

const server = http.createServer(app)
server.listen(4000)

logger.info('API server is listening on port 4000')

app.use(
  '/trpc',
  ClerkExpressWithAuth(),
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext }),
)
