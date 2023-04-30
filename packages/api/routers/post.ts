import { router, publicProcedure } from 'api/trpc'
import { v4 as uuid } from 'uuid'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as getSignedUrlAWS } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'
import { s3 } from 'api/s3'

export const postRouter = router({
  getImageUploadUrl: publicProcedure.query(async () => {
    const imageKey = `${uuid()}.jpg`
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
    })
    return {
      imageUploadUrl: await getSignedUrlAWS(s3, putObjectCommand),
      imageKey,
    }
  }),
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany()
  }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number().int(),
        imageUrl: z.string().url(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: input,
      })
    }),
})
