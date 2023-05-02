import { router, publicProcedure, protectedProcedure } from 'api/trpc'
import { z } from 'zod'
import { Zone } from 'db'
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

const list = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.post.findMany({
    include: {
      images: {
        select: {
          url: true,
        },
      },
    },
  })
})

const create = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      zone: z.nativeEnum(Zone).optional(),
      price: z.number().int(),
      images: z.string().url().array(),
    })
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.post.create({
      data: {
        ...input,
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
  list,
  create,
})
