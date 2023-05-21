import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  endpoint: process.env.S3_BUCKET_ENDPOINT,
  region: process.env.S3_BUCKET_REGION,
})
