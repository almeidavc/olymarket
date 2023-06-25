import { View } from 'app/design/core'
import { Text, Caption } from 'app/design/typography'
import { ScrollView } from 'react-native'
import { trpc } from 'app/utils/trpc'
import { PostCategoryTitles, PostStatus, ZoneTitles } from 'app/utils/enums'
import { useRouter } from 'solito/router'
import { useAuth } from '@clerk/clerk-expo'
import dayjs from 'app/utils/dayjs'
import { ImageSlider } from 'app/components/image-slider'
import { Button } from 'app/components/button'
import { Image } from 'app/design/image'
import { formatPrice } from './utils'
import { MapPinIcon, TagIcon } from 'react-native-heroicons/outline'

export function PostScreen({ route }) {
  const router = useRouter()

  const { userId, isSignedIn } = useAuth()

  const { postId } = route.params

  const { data: post } = trpc.post.getById.useQuery({
    id: postId,
  })

  const context = trpc.useContext()

  const { mutate: findOrCreateChatMutation } =
    trpc.chat.findOrCreate.useMutation()

  const { mutate: removePostMutation, isLoading: isRemovePostLoading } =
    trpc.post.remove.useMutation({
      onSuccess: (removedPost) => {
        context.post.search.invalidate()

        context.post.list.invalidate()

        context.post.listMine.setData(undefined, (oldPosts) => {
          if (oldPosts) {
            return oldPosts.filter((post) => post.id !== removedPost.id)
          }
        })

        context.chat.list.setData(undefined, (oldChats) => {
          if (oldChats) {
            return oldChats.map((chat) => {
              if (chat.post.id === removedPost.id) {
                return {
                  ...chat,
                  post: {
                    ...chat.post,
                    status: PostStatus.REMOVED,
                  },
                }
              }
              return chat
            })
          }
        })

        router.back()
      },
    })

  const onContactButtonPress = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    findOrCreateChatMutation(
      {
        postId,
        partnerId: post!.authorId,
      },
      {
        onSuccess: (chat) => {
          router.push(`/chat/${chat?.id}`)
        },
      }
    )
  }

  const onEditPostPress = () => {
    router.push(`/edit/post/${post!.id}`)
  }

  const onRemovePostPress = () => {
    removePostMutation({ postId: post!.id })
  }

  const onReportPostPress = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    router.push(`/report/${postId}`)
  }

  if (!post) {
    return <Text>404</Text>
  }

  return (
    <ScrollView>
      <ImageSlider imageUris={post.images.map((img) => img.url)} />
      <View className="p-4">
        <View className="border-background flex flex-row items-center justify-between border-b pb-4">
          <View className="flex flex-row items-center">
            <Image
              className="mr-3 h-12 w-12 rounded-full"
              source={{ uri: post.author.profileImageUrl }}
            />
            <View>
              <Text className="mb-1">{post.author.username}</Text>
              <Caption>{dayjs().to(dayjs(post?.createdAt))}</Caption>
            </View>
          </View>
          {userId !== post.authorId && (
            <Button title="Contact seller" onPress={onContactButtonPress} />
          )}
        </View>
        <View className="border-background border-b py-4">
          <Text className="mb-2 text-2xl font-bold">{post.title}</Text>
          <Text className="mb-1.5 text-xl font-bold text-sky-700">
            {formatPrice(post.price)}
          </Text>
          <View className="mb-1 flex flex-row items-center">
            <TagIcon color="black" size={17} />
            <Text className="ml-1.5 text-base text-gray-500">
              {PostCategoryTitles.get(post.category)}
            </Text>
          </View>
          {post.zone !== 'NONE' && (
            <View className="flex flex-row items-center">
              <MapPinIcon color="black" size={17} />
              <Text className="ml-1.5 text-base text-gray-500">
                {ZoneTitles.get(post.zone)}
              </Text>
            </View>
          )}
        </View>
        {post.description && (
          <View className="border-background border-b py-4">
            <Text>{post.description}</Text>
          </View>
        )}
        {userId === post.authorId && (
          <View className="py-4">
            <Button
              className="mb-4 w-full"
              variant={'secondary'}
              title="Edit post"
              onPress={onEditPostPress}
            />
            <Button
              loading={isRemovePostLoading}
              className="w-full"
              title="Remove post"
              onPress={onRemovePostPress}
            />
          </View>
        )}
        {userId !== post.authorId && (
          <View className="py-4">
            <Button
              variant="secondary"
              title="Report post"
              onPress={onReportPostPress}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
