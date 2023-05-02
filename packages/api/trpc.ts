import { initTRPC } from '@trpc/server'
import { Context } from './context'
import { TRPCError } from '@trpc/server'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)

export type { AppRouter } from './routers'
