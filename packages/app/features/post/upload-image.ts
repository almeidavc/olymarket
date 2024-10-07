import { manipulateAsync } from 'expo-image-manipulator'

export async function compressAndUploadImage(imageUri, uploadImageUrl) {
  // compress image
  const compressed = await manipulateAsync(imageUri, [], { compress: 0.5 })

  // read compressed image from fs
  const response = await fetch(compressed.uri)
  const blob = await response.blob()

  // upload image
  const result = await fetch(uploadImageUrl, {
    method: 'PUT',
    body: blob,
  })

  return result
}

export function compressAndUploadImages(imageUris, uploadImageUrls) {
  const uploads: any[] = []
  for (let i = 0; i < imageUris.length; i++) {
    uploads.push(compressAndUploadImage(imageUris[i], uploadImageUrls[i]))
  }
  return Promise.all(uploads)
}
