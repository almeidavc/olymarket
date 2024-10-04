import { inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { Request } from 'express'
import { LooseAuthProp } from '@clerk/clerk-sdk-node'
import { Client } from '@elastic/elasticsearch'
import { PrismaClient } from '@prisma/client'

type RequestWithAuth = Request & Partial<LooseAuthProp>

type CreateContextOptions = Omit<CreateExpressContextOptions, 'req'> & {
  req: RequestWithAuth
}

// const elastic = new Client({
//   node: process.env.ELASTICSEARCH_NODE_URL,
//   auth: {
//     username: 'elastic',
//     password: process.env.ELASTIC_PASSWORD,
//   },
// })

export const prisma = new PrismaClient()

export function createContext({ req }: CreateContextOptions) {
  return {
    auth: req.auth,
    // elastic: elastic,
    prisma: prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
