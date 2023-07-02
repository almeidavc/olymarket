const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3')
const sharp = require('sharp')
const mysql = require('mysql')

exports.handler = async (event) => {
  const s3 = new S3Client()

  // Collect the object key from the S3 event record
  const { key } = event.Records[0].s3.object

  // Collect the full resolution image from s3 using the object key
  const uncompressedImage = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.UNCOMPRESSED_BUCKET,
      Key: key,
    })
  )

  const uncompressedImageBytes =
    await uncompressedImage.Body.transformToByteArray()

  // Compress the image to a 200x200 avatar square as a buffer, without stretching
  const compressedImageBuffer = await sharp(uncompressedImageBytes)
    .resize({ width: 800 })
    // to keep original orientation
    .withMetadata()
    .toBuffer()

  // Upload the compressed image buffer to the Compressed Images bucket
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.COMPRESSED_BUCKET,
      Key: key,
      Body: compressedImageBuffer,
    })
  )

  const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
    },
  })

  await new Promise((resolve) => {
    database.connect(() => {
      const compressedImageUrl = `https://${process.env.COMPRESSED_BUCKET}.s3.eu-central-1.amazonaws.com/${key}`

      // update url of image record in database
      database.query('UPDATE Image SET url = ? WHERE externalKey = ?;', [
        compressedImageUrl,
        key,
      ])

      // update updatedAt column of post record to sync with elasticsearch
      database.query(
        `UPDATE Post SET updatedAt = CURRENT_TIMESTAMP()
        WHERE id = (SELECT postId FROM Image WHERE externalKey = ?);`,
        [key],
        () => {
          database.destroy()
          resolve()
        }
      )
    })
  })
}
