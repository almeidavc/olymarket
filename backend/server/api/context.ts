import { inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { elastic } from '../elastic'
import { prisma } from '../prisma'
import { Request } from 'express'
import { LooseAuthProp } from '@clerk/clerk-sdk-node'

type RequestWithAuth = Request & Partial<LooseAuthProp>

type CreateContextOptions = Omit<CreateExpressContextOptions, 'req'> & {
  req: RequestWithAuth
}
export function createContext({ req }: CreateContextOptions) {
  return {
    auth: req.auth,
    elastic: elastic,
    prisma: prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
