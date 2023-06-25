import { useState } from 'react'
import { trpc } from 'app/utils/trpc'
import { uploadImages } from './upload-image'
import { PostForm } from './post-form'
import { Modal } from 'react-native'
import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { AntDesign } from '@expo/vector-icons'
import { Button } from 'app/components/button'

export function EditPost({ route, navigation }) {
  const { postId } = route.params

  const [isEditPostLoading, setIsEditPostLoading] = useState(false)
  const [showPostEditedModal, setShowPostEditedModal] = useState(false)

  const context = trpc.useContext()

  const { data: post } = trpc.post.getById.useQuery({
    id: postId,
  })

  const { mutate: generateUploadUrlsMutation } =
    trpc.post.generateImageUploadUrls.useMutation()

  const { mutate: updatePostMutation } = trpc.post.update.useMutation({
    onSuccess: (updatedPost) => {
      context.post.getById.setData({ id: updatedPost.id }, () => updatedPost)
      context.post.search.invalidate()
      context.post.list.invalidate()
      context.post.listMine.setData(undefined, (oldPosts) => {
        return oldPosts?.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      })
    },
  })

  const { mutate: updateImagesMutation } = trpc.post.updateImages.useMutation({
    onSuccess: (updatedPost) => {
      context.post.getById.invalidate({ id: updatedPost.id })
      context.post.search.invalidate()
      context.post.list.invalidate()
      context.post.listMine.invalidate()
    },
  })

  const editImages = (imageUris) => {
    const newImages = imageUris.filter((uri) => uri.startsWith('file'))
    if (newImages.length) {
      return new Promise<void>(async (resolve, reject) => {
        generateUploadUrlsMutation(
          {
            count: newImages.length,
          },
          {
            onSuccess: async (imageUploadUrls) => {
              try {
                await uploadImages(
                  newImages,
                  imageUploadUrls.map((img) => img.url)
                )
              } catch {
                throw new Error(
                  'Something went wrong while uploading the images'
                )
              }

              let i = 0
              const images = imageUris.map((imgUri) =>
                imgUri.startsWith('file')
                  ? {
                      externalKey: imageUploadUrls[i++].key,
                    }
                  : post?.images.find((img) => img.url === imgUri)
              )
              updateImagesMutation(
                {
                  id: postId,
                  images,
                },
                {
                  onSuccess: () => {
                    resolve()
                  },
                }
              )
            },
          }
        )
      })
    }

    const images = imageUris.map((imgUri) =>
      post?.images.find((img) => img.url === imgUri)
    )

    return new Promise<void>((resolve) => {
      updateImagesMutation(
        {
          id: postId,
          images,
        },
        {
          onSuccess: () => {
            resolve()
          },
        }
      )
    })
  }

  const editPost = async (editedPost, imageUris) => {
    setIsEditPostLoading(true)

    const updateImagesRes = editImages(imageUris)
    const updatePostRes = updatePostMutation({
      ...editedPost,
      id: postId,
    })

    return new Promise<void>(async (resolve) => {
      await Promise.all([updateImagesRes, updatePostRes])
      setIsEditPostLoading(false)
      setShowPostEditedModal(true)
    })
  }

  return (
    <>
      <Modal
        visible={showPostEditedModal}
        animationType="slide"
        onDismiss={() => navigation.goBack()}
      >
        <View className="mb-32 flex flex-grow items-center justify-center">
          <View className="mx-auto mb-3.5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 p-2 dark:bg-green-900">
            <AntDesign name="check" size={50} color="#22c55e" />
          </View>
          <Text className="mb-4 text-4xl font-extrabold  text-gray-900">
            Success!
          </Text>
          <Text className="mb-8 text-2xl font-normal text-gray-500">
            Your post has been updated.
          </Text>
          <Button
            title="Go back"
            onPress={() => setShowPostEditedModal(false)}
          />
        </View>
      </Modal>
      <PostForm
        submit={editPost}
        submitLabel="Edit post"
        isSubmitLoading={isEditPostLoading}
        defaultValues={post}
      />
    </>
  )
}
