import { router, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { assertIsModerator } from '../utils/roles'
import clerk from '@clerk/clerk-sdk-node'
import axios from 'axios'

const getById = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
    })
  })

const _delete = protectedProcedure.mutation(async ({ ctx }) => {
  const res = await clerk.users.deleteUser(ctx.auth.userId)

  if (res.deleted) {
    return {
      userId: res.id,
    }
  }

  return null
})

const ban = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await assertIsModerator(ctx.auth.userId)

    const res = await axios({
      method: 'post',
      url: `${process.env.EXPO_PUBLIC_CLERK_API_URL_V1}/users/${input.userId}/ban`,
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })

    if (res.status === 200) {
      return {
        userId: input.userId,
      }
    }

    return null
  })

export const userRouter = router({
  delete: _delete,
  getById,
  ban,
})
