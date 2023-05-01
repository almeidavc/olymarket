import { s3 } from 'api/s3'
import { v4 as uuid } from 'uuid'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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
