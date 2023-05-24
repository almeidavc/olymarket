export async function uploadImage(imageUri, uploadImageUrl) {
  // read image from fs
  const response = await fetch(imageUri)
  const blob = await response.blob()

  // upload image
  const result = await fetch(uploadImageUrl, {
    method: 'PUT',
    body: blob,
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
