export async function uploadImages(imageUri, uploadImageUrl) {
  // read image from fs
  const response = await fetch(imageUri)
  const blob = await response.blob()

  // upload image
  const result = await fetch(uploadImageUrl, {
    method: 'PUT',
    headers: {
      contentType: 'image/jpeg',
    },
    body: new File([blob], 'test.jpg'),
  })
  return result
}

export function getImageDownloadUrl(imageKey) {
  return `${process.env.S3_BUCKET_URL}/${imageKey}`
}
