import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { logger } from '@olymarket/backend-utils'

// https://www.backblaze.com/docs/cloud-storage-use-the-aws-sdk-for-javascript-v3-with-backblaze-b2

export const s3 = new S3Client({
  region: process.env.B2_BUCKET_REGION,
  endpoint: process.env.B2_BUCKET_ENDPOINT,
})

export async function getSignedUploadUrl() {
  const objectKey = `${uuid()}.jpg`
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: objectKey,
  })
  const signedUrl = await getSignedUrl(s3, putObjectCommand)
  logger.debug(`Got signed url to put object: ${signedUrl}`)
  return {
    url: signedUrl,
    key: objectKey,
  }
}

export function getImageDownloadUrl(key: string) {
  return `${process.env.B2_BUCKET_ENDPOINT}/${key}`
}

export function deleteImage(key: string) {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
  })
  return s3.send(deleteObjectCommand)
}
