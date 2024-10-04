import { appRouter } from './routers'
import { createContext } from './context'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import * as trpcExpress from '@trpc/server/adapters/express'
import { app } from '../app'

app.use(
  '/trpc',
  ClerkExpressWithAuth(),
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
)
