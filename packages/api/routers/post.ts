import { router, publicProcedure } from 'api/trpc'

export const postRouter = router({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany()
  }),
})
