import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      })
    }),
})
