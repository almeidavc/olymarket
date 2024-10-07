import { useState } from 'react'
import { trpc } from 'app/utils/trpc'
import { compressAndUploadImages } from './upload-image'
import { PostFormScreen } from './post-form'
import { Modal, SafeAreaView } from 'react-native'
import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { AntDesign } from '@expo/vector-icons'
import { Button } from 'app/components/button'
import { useRouter } from 'solito/router'

export function CreatePost() {
  const router = useRouter()

  const [isCreatePostLoading, setIsCreatePostLoading] = useState(false)
  const [showPostCreatedModal, setShowPostCreatedModal] = useState(false)

  const context = trpc.useContext()

  const { mutate: generateUploadUrlsMutation } =
    trpc.post.generateImageUploadUrls.useMutation()

  const { mutate: createPostMutation } = trpc.post.create.useMutation()

  const { mutate: updateImagesMutation } = trpc.post.updateImages.useMutation({
    onSuccess: () => {
      context.post.search?.invalidate()
      context.post.listMine?.invalidate()
    },
  })

  const createPost = (post, images) => {
    setIsCreatePostLoading(true)
    return new Promise<void>((resolve) => {
      createPostMutation(
        { ...post },
        {
          onSuccess: (createdPost) => {
            generateUploadUrlsMutation(
              { count: images.length },
              {
                onSuccess: async (uploadUrls) => {
                  try {
                    await compressAndUploadImages(
                      images,
                      uploadUrls.map((img) => img.url),
                    )
                  } catch (error) {
                    throw new Error(
                      'Something went wrong while uploading the images',
                      { cause: error },
                    )
                  }

                  updateImagesMutation(
                    {
                      id: createdPost.id,
                      images: uploadUrls.map((img) => ({
                        key: img.key,
                      })),
                    },
                    {
                      onSuccess: () => {
                        resolve()
                        setIsCreatePostLoading(false)
                        setShowPostCreatedModal(true)
                      },
                    },
                  )
                },
              },
            )
          },
        },
      )
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <Modal
        visible={showPostCreatedModal}
        animationType="slide"
        onDismiss={() => router.push('/profile/selling')}
      >
        <View className="mb-32 flex flex-grow items-center justify-center">
          <View className="mx-auto mb-3.5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 p-2 dark:bg-green-900">
            <AntDesign name="check" size={50} color="#22c55e" />
          </View>
          <Text className="mb-4 text-4xl font-extrabold text-gray-900">
            Success!
          </Text>
          <Text className="mb-8 text-2xl font-normal text-gray-500">
            Your post has been created.
          </Text>
          <Button
            title="See your posts"
            onPress={() => setShowPostCreatedModal(false)}
          />
        </View>
      </Modal>
      <PostFormScreen
        submit={createPost}
        submitLabel="Create post"
        isSubmitLoading={isCreatePostLoading}
      />
    </SafeAreaView>
  )
}
