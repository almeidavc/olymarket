import { router, publicProcedure, protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { Zone, PostStatus, PostCategory } from '@prisma/client'
import {
  deleteImage,
  getImageDownloadUrl,
  getSignedUploadUrl,
} from '../../../s3'
import { TRPCError } from '@trpc/server'
import { assertIsModerator, isModerator } from '../../utils/roles'
import { assertIsAuthor, assertPostExists, findPostById } from './utils'

const getById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    return await findPostById(input.id)
  })

const list = publicProcedure
  .input(
    z
      .object({
        categories: z.array(z.nativeEnum(PostCategory)),
        limit: z.number().optional(),
        cursor: z.string().optional(),
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    const categories = input?.categories.length
      ? input.categories
      : Object.keys(PostCategory)

    const limit = input?.limit ?? 50
    const cursor = input?.cursor ? { id: input.cursor } : undefined

    const posts = await ctx.prisma.post.findMany({
      take: limit + 1,
      cursor: cursor,
      where: {
        status: PostStatus.CREATED,
        category: {
          in: categories,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
      },
    })

    let nextCursor = undefined
    if (posts.length > limit) {
      nextCursor = posts.pop().id
    }

    return {
      posts,
      pagination: {
        nextCursor,
      },
    }
  })

const listMine = protectedProcedure.query(({ ctx }) => {
  return ctx.prisma.post.findMany({
    where: {
      authorId: ctx.auth.userId,
      status: PostStatus.CREATED,
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
  await assertIsModerator(ctx.auth.userId!)

  return ctx.prisma.post.findMany({
    where: {
      status: PostStatus.CREATED,
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

const search = publicProcedure
  .input(
    z.object({
      query: z.string().optional(),
      categories: z.array(z.nativeEnum(PostCategory)).optional(),
      limit: z.number().optional(),
      cursor: z.any().array().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const categories = input.categories?.length
      ? input.categories
      : Object.keys(PostCategory)

    const limit = input?.limit ?? 50
    const cursor = input?.cursor

    let query
    if (input.query) {
      query = {
        multi_match: {
          query: input.query,
          fields: ['title^2', 'description', 'author.username'],
          fuzziness: 'auto',
          operator: 'or',
        },
      }
    } else {
      query = {
        match_all: {},
      }
    }

    const res = await ctx.elastic.search({
      index: 'posts_idx',
      body: {
        query: {
          bool: {
            must: [query],
            filter: [
              {
                term: {
                  'status.keyword': PostStatus.CREATED,
                },
              },
              {
                terms: {
                  'category.keyword': categories,
                },
              },
            ],
          },
        },
        size: limit,
        sort: [
          {
            _score: 'desc',
          },
          {
            'id.keyword': 'desc',
          },
        ],
        search_after: cursor,
      },
    })

    const hits = res.body.hits.hits

    let nextCursor = undefined
    if (hits.length === limit) {
      nextCursor = hits[hits.length - 1].sort
    }

    return {
      posts: hits.map((hit) => hit._source),
      pagination: {
        nextCursor,
      },
    }
  })

const generateImageUploadUrls = protectedProcedure
  .input(z.object({ count: z.number().int().positive() }))
  .mutation(async ({ input }) => {
    const urls: Promise<{ url: string; key: string }>[] = []
    for (let i = 0; i < input.count; i++) {
      urls.push(getSignedUploadUrl())
    }
    return await Promise.all(urls)
  })

const create = protectedProcedure
  .input(
    z.object({
      category: z.nativeEnum(PostCategory),
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
            id: ctx.auth.userId!,
          },
        },
      },
    })
  })

const update = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      category: z.nativeEnum(PostCategory),
      price: z.number().int(),
      title: z.string(),
      description: z.string().optional(),
      zone: z.nativeEnum(Zone).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const post = await findPostById(input.id)
    assertPostExists(post)
    assertIsAuthor(post, ctx.auth?.userId)

    return await ctx.prisma.post.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        category: input.category,
        zone: input.zone,
      },
      include: {
        author: true,
        images: true,
      },
    })
  })

const updateImages = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      images: z
        .object({
          id: z.string().optional(),
          externalKey: z.string(),
        })
        .array(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const post = await findPostById(input.id)
    assertPostExists(post)
    assertIsAuthor(post, ctx.auth?.userId)

    const oldImages = post.images
    const removedImages = oldImages.filter(
      (oldImg) => !input.images.some((img) => img.id === oldImg.id)
    )
    const addedImages = input.images.filter(
      (img) => !oldImages.some((oldImg) => oldImg.id === img.id)
    )

    return await ctx.prisma.post.update({
      where: {
        id: input.id,
      },
      data: {
        images: {
          createMany: {
            data: addedImages.map((img) => ({
              externalKey: img.externalKey,
              url: getImageDownloadUrl(img.externalKey),
            })),
          },
          deleteMany: {
            id: {
              in: removedImages.map((img) => img.id),
            },
          },
        },
      },
      include: {
        author: true,
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
  getById,
  list,
  listMine,
  listReported,
  search,
  generateImageUploadUrls,
  create,
  update,
  updateImages,
  remove,
  markAsSold,
  report,
})
