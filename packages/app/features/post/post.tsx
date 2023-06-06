import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { ScrollView } from 'react-native'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { PostStatus, ZoneTitles } from 'app/utils/enums'
import { useRouter } from 'solito/router'
import { useAuth } from '@clerk/clerk-expo'
import dayjs from 'app/utils/dayjs'
import { ImageSlider } from 'app/components/image-slider'
import { Button } from 'app/components/button'

export function PostScreen({ route }) {
  const router = useRouter()

  const { userId } = useAuth()

  const { context: ctx, postId } = route.params

  const { data: post } = trpc.post.getById.useQuery(postId)

  const { mutate: findOrCreateChatMutation } =
    trpc.chat.findOrCreate.useMutation()

  const context = trpc.useContext()

  const { mutate: banUserMutation } = trpc.user.ban.useMutation()

  const { mutate: removePostMutation, isLoading: isRemovePostLoading } =
    trpc.post.remove.useMutation({
      onSuccess: (removedPost) => {
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

  // const { mutate: markAsSold } = trpc.post.markAsSold.useMutation({
  //   onSuccess: (soldPost) => {
  //     context.post.list.invalidate()
  //     context.post.listMine.setData(undefined, (oldPosts) => {
  //       if (oldPosts) {
  //         return oldPosts.map((post) =>
  //           post.id === soldPost.id
  //             ? {
  //                 ...post,
  //                 status: PostStatus.SOLD,
  //               }
  //             : post
  //         )
  //       }
  //     })
  //   },
  // })

  const onContactButtonPress = () => {
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

  const onRemovePostPress = () => {
    removePostMutation({ postId: post!.id })
  }

  // const onMarkPostAsSoldPress = () => {
  //   markAsSold({ postId: post!.id })
  // }

  const onReportPostPress = () => {
    router.push(`/post/${postId}/report`)
  }

  if (!post) {
    return <Text>404</Text>
  }

  return (
    <ScrollView>
      <ImageSlider imageUris={post.images.map((img) => img.url)} />
      <View className="divide-y divide-gray-300">
        <View className="flex flex-row items-center justify-between p-4">
          <View className="flex flex-row items-center">
            <Image
              className="mr-3 h-12 w-12 rounded-full"
              source={{ uri: post.author.profileImageUrl }}
            />
            <View>
              <Text className="mb-1">{post.author.username}</Text>
              <Text className="text-gray-600">
                {dayjs().to(dayjs(post?.createdAt))}
              </Text>
            </View>
          </View>
          {userId !== post.authorId && (
            <Button title="Contact seller" onPress={onContactButtonPress} />
          )}
        </View>
        <View className="p-4">
          <Text className="mb-1 text-xl">{post.title}</Text>
          <Text className="mb-1 text-lg font-bold text-sky-900">
            {new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }).format(post.price)}
          </Text>
          {post.zone !== 'NONE' && (
            <Text className="text-gray-600">
              <FontAwesome5 name="map-marker-alt" color="#4b5563" />{' '}
              {ZoneTitles.get(post.zone)}
            </Text>
          )}
        </View>
        {post.description && (
          <View className="p-4">
            <Text className="mb-2 text-gray-600">Description</Text>
            <Text>{post.description}</Text>
          </View>
        )}
        {(userId === post.authorId || ctx === 'moderate') && (
          <View className="p-4">
            <Button
              loading={isRemovePostLoading}
              className="w-full"
              title="Remove post"
              onPress={onRemovePostPress}
            />
          </View>
        )}
        {userId !== post.authorId && ctx !== 'moderate' && (
          <View className="p-4">
            <Button
              variant="secondary"
              title="Report post"
              onPress={onReportPostPress}
            />
          </View>
        )}
        {ctx === 'moderate' && (
          <View className="p-4">
            <Button
              variant="danger"
              title="Ban user"
              onPress={() => {
                banUserMutation({ userId: post.authorId })
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
