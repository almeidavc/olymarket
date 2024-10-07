import { Post, Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { prisma } from '../../context'
import { getSignedDownloadUrl } from '../../s3'

export const findPostById = (
  id: string,
): Prisma.PostGetPayload<{ include: { images: true } }> => {
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

export const resolveImageUrls = async (
  post: Prisma.PostGetPayload<{ include: { images: true } }>,
) => {
  const imageUrls = await Promise.all(
    post.images.map((image) => getSignedDownloadUrl(image.key)),
  )
  return {
    ...post,
    images: post.images.map((image, i) => ({
      ...image,
      url: imageUrls[i],
    })),
  }
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
