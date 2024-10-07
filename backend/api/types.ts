import * as Prisma from '@prisma/client'

type ImageWithUrl = Prisma.Image & { url: string }

export type Post = Prisma.Post & {
  images: ImageWithUrl[]
}

export type GetByIdResponse = Post | null
export type SearchResponse = {
  posts: Post[]
  pagination: {
    nextCursor: string | undefined
  }
}
export type ListMineResponse = Post[]
export type listReportedResponse = Post[]
