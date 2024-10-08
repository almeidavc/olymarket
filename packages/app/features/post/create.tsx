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
import { Image } from './image-select'

export function CreatePost() {
  const router = useRouter()

  const [isCreatePostLoading, setIsCreatePostLoading] = useState(false)
  const [showPostCreatedModal, setShowPostCreatedModal] = useState(false)

  const context = trpc.useContext()

  const { mutateAsync: createPostMutation } = trpc.post.create.useMutation()

  const { mutateAsync: generateUploadUrlsMutation } =
    trpc.post.generateImageUploadUrls.useMutation()

  const { mutateAsync: updateImagesMutation } =
    trpc.post.updateImages.useMutation({
      onSuccess: () => {
        context.post.search?.invalidate()
        context.post.listMine?.invalidate()
      },
    })

  const createPost = async (post, images: Image[]) => {
    setIsCreatePostLoading(true)
    const created = await createPostMutation({ ...post })
    const uploadUrls = await generateUploadUrlsMutation({
      count: images.length,
    })
    try {
      await compressAndUploadImages(
        images.map((img) => img.url),
        uploadUrls.map((img) => img.url),
      )
    } catch (error) {
      throw new Error('Something went wrong while uploading the images', {
        cause: error,
      })
    }

    await updateImagesMutation({
      id: created.id,
      images: uploadUrls.map((img) => ({
        key: img.key,
      })),
    })
    setIsCreatePostLoading(false)
    setShowPostCreatedModal(true)
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
