import { inferAsyncReturnType } from '@trpc/server'
import { prisma } from 'db'

export function createContext() {
  return {
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
