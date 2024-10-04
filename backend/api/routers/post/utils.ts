import { Post } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { prisma } from '../../context'

export const findPostById = (id: string) => {
  return prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      images: true,
    },
  })
}

export const assertPostExists = (post: Post | null) => {
  if (!post?.id) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
}

export const assertIsAuthor = (post: Post, userId: string) => {
  if (post?.authorId !== userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
}
