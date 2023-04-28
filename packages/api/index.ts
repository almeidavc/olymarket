import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './routers'
import cors from 'cors'
import { createContext } from './context'

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
})

server.listen(4000)
