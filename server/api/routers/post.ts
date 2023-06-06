import { router, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { Zone, PostStatus } from '@prisma/client'
import { deleteImage, getImageDownloadUrl, getSignedUploadUrl } from '../s3'
import { TRPCError } from '@trpc/server'
import { assertIsModerator, isModerator } from '../utils/roles'

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
      images: true,
    },
  })
})

const list = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.post.findMany({
    where: {
      status: {
        notIn: [PostStatus.REMOVED, PostStatus.SOLD],
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true,
    },
  })
})

const listMine = protectedProcedure.query(({ ctx }) => {
  return ctx.prisma.post.findMany({
    where: {
      authorId: ctx.auth.userId,
      status: {
        not: PostStatus.REMOVED,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true,
    },
  })
})

const listReported = protectedProcedure.query(async ({ ctx }) => {
  await assertIsModerator(ctx.auth.userId)

  return ctx.prisma.post.findMany({
    where: {
      status: {
        not: PostStatus.REMOVED,
      },
      reports: {
        some: {},
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true,
      reports: true,
    },
  })
})

const create = protectedProcedure
  .input(
    z.object({
      images: z.string().array(),
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
            data: input.images.map((key) => ({
              externalKey: key,
              url: getImageDownloadUrl(key),
            })),
          },
        },
      },
      include: {
        images: true,
      },
    })
  })

const remove = protectedProcedure
  .input(z.object({ postId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
      include: {
        images: true,
      },
    })

    if (!post) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    if (
      post.authorId !== ctx.auth.userId &&
      !(await isModerator(ctx.auth.userId))
    ) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    await ctx.prisma.post.update({
      where: {
        id: input.postId,
      },
      data: {
        status: PostStatus.REMOVED,
      },
    })

    post?.images?.forEach((img) => deleteImage(img.externalKey))

    return post
  })

const markAsSold = protectedProcedure
  .input(z.object({ postId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
    })

    if (post?.authorId !== ctx.auth.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return await ctx.prisma.post.update({
      where: {
        id: input.postId,
      },
      data: {
        status: PostStatus.SOLD,
      },
    })
  })

const report = protectedProcedure
  .input(z.object({ postId: z.string(), reason: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
    })

    if (!post) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    return await ctx.prisma.postReport.create({
      data: {
        post: {
          connect: {
            id: input.postId,
          },
        },
        reason: input.reason,
        reporter: {
          connect: {
            id: ctx.auth.userId,
          },
        },
      },
    })
  })

export const postRouter = router({
  getImageUploadUrls,
  getById,
  list,
  listMine,
  listReported,
  create,
  remove,
  markAsSold,
  report,
})
