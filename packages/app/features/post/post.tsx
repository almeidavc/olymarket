import { View } from 'app/design/core'
import { Text, Title, Caption } from 'app/design/typography'
import { ScrollView } from 'react-native'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { PostCategoryTitles, PostStatus, ZoneTitles } from 'app/utils/enums'
import { useRouter } from 'solito/router'
import { useAuth } from '@clerk/clerk-expo'
import dayjs from 'app/utils/dayjs'
import { ImageSlider } from 'app/components/image-slider'
import { Button } from 'app/components/button'
import { Image } from 'app/design/image'

export function PostScreen({ route }) {
  const router = useRouter()

  const { userId, isSignedIn } = useAuth()

  const { postId } = route.params

  const { data: post } = trpc.post.getById.useQuery(postId)

  const { mutate: findOrCreateChatMutation } =
    trpc.chat.findOrCreate.useMutation()

  const context = trpc.useContext()

  const { mutate: banUserMutation } = trpc.user.ban.useMutation()

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

  const onRemovePostPress = () => {
    removePostMutation({ postId: post!.id })
  }

  // const onMarkPostAsSoldPress = () => {
  //   markAsSold({ postId: post!.id })
  // }

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
      <View className="px-4">
        <View className="border-background flex flex-row items-center justify-between border-b py-4">
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
        <View className="my-4">
          <Caption className="mb-1">
            {PostCategoryTitles.get(post.category)}
          </Caption>
          <Title className="mb-2">{post.title}</Title>
          <Text>
            {new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }).format(post.price)}
          </Text>
        </View>
        {post.zone !== 'NONE' && (
          <View className="my-4">
            <Text>
              <FontAwesome5 name="map-marker-alt" /> {ZoneTitles.get(post.zone)}
            </Text>
          </View>
        )}
        {post.description && (
          <View className="py-4">
            <Title className="mb-2">Description</Title>
            <Text>{post.description}</Text>
          </View>
        )}
        {userId === post.authorId && (
          <View className="py-4">
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
        {/* {ctx === 'moderate' && (
          <View className="p-4">
            <Button
              variant="danger"
              title="Ban user"
              onPress={() => {
                banUserMutation({ userId: post.authorId })
              }}
            />
          </View>
        )} */}
      </View>
    </ScrollView>
  )
}
