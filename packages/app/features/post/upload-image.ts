export async function uploadImage(imageUri, uploadImageUrl) {
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

export function uploadImages(imageUris, uploadImageUrls) {
  const uploads: any[] = []
  for (let i = 0; i < imageUris.length; i++) {
    uploads.push(uploadImage(imageUris[i], uploadImageUrls[i]))
  }
  return Promise.all(uploads)
}

export function getImageDownloadUrl(imageKey) {
  return `${process.env.S3_BUCKET_URL}/${imageKey}`
}