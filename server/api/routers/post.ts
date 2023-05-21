import { router, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { Zone } from '@prisma/client'
import { getSignedUploadUrl } from '../helpers/signed-url'

const getImageUploadUrls = publicProcedure
  .input(z.number().int().positive())
  .query(async ({ input }) => {
    const urls: Promise<{ url: string; key: string }>[] = []
    for (let i = 0; i < input; i++) {
      urls.push(getSignedUploadUrl())
    }
    return await Promise.all(urls)
  })

const getById = publicProcedure.input(z.string()).query(({ ctx, input }) => {
  return ctx.prisma.post.findUnique({
    where: {
      id: input,
    },
    include: {
      author: true,
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  })
})

const list = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  })
})

const create = protectedProcedure
  .input(
    z.object({
      images: z.string().url().array(),
      price: z.number().int(),
      title: z.string(),
      description: z.string().optional(),
      zone: z.nativeEnum(Zone).optional(),
    })
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.post.create({
      data: {
        ...input,
        author: {
          connect: {
            id: ctx.auth.userId,
          },
        },
        images: {
          createMany: {
            data: input.images.map((url) => ({ url })),
          },
        },
      },
    })
  })

export const postRouter = router({
  getImageUploadUrls,
  getById,
  list,
  create,
})
