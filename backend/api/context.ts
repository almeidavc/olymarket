import { inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { Request } from 'express'
import { LooseAuthProp } from '@clerk/clerk-sdk-node'
import { PrismaClient } from '@olymarket/db'
import { createClient } from '@supabase/supabase-js'

type RequestWithAuth = Request & Partial<LooseAuthProp>

type CreateContextOptions = Omit<CreateExpressContextOptions, 'req'> & {
  req: RequestWithAuth
}

export const prisma = new PrismaClient()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
)

export function createContext({ req }: CreateContextOptions) {
  return {
    auth: req.auth,
    prisma,
    supabase,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
