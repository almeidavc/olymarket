import { inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { prisma } from '../prisma'
import { Request } from 'express'
import { LooseAuthProp } from '@clerk/clerk-sdk-node'

type RequestWithAuth = Request & Partial<LooseAuthProp>

type CreateContextOptions = Omit<CreateExpressContextOptions, 'req'> & {
  req: RequestWithAuth
}
export function createContext({ req }: CreateContextOptions) {
  return {
    prisma: prisma,
    auth: req.auth,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
