import { inferAsyncReturnType } from '@trpc/server'
import { prisma } from 'db'

export function createContext({ req }) {
  return {
    prisma,
    auth: req.auth,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
