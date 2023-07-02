import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3 = new S3Client({
  region: process.env.S3_REGION,
})

export async function getSignedUploadUrl() {
  const objectKey = `${uuid()}.jpg`
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: objectKey,
  })
  return {
    url: await getSignedUrl(s3, putObjectCommand),
    key: objectKey,
  }
}

export function getImageDownloadUrl(key: string) {
  return `${process.env.S3_BUCKET_URL}/${key}`
}

export function deleteImage(key: string) {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  })
  return s3.send(deleteObjectCommand)
}
