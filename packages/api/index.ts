import { appRouter } from './routers'
import cors from 'cors'
import { createContext } from './context'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'

const app = express()
app.use(cors())

app.use(
  '/trpc',
  ClerkExpressWithAuth(),
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
)

app.listen(4000)
