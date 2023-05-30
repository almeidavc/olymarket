import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { ScrollView } from 'react-native'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { ZoneTitles } from 'app/utils/enums'
import { useRouter } from 'solito/router'
import { useAuth } from '@clerk/clerk-expo'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { Link } from 'solito/link'
import dayjs from 'app/utils/dayjs'
import { ImageSlider } from 'app/components/image-slider'
import { Button } from 'app/components/button'

interface PostCardProps {
  post: inferProcedureOutput<AppRouter['post']['list']>[number]
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/post/${post.id}`}>
      <View className="rounded-lg border border-gray-300 bg-white shadow">
        <Image
          className="h-[25vh] w-full rounded-t-lg"
          resizeMode="cover"
          source={{
            uri: post.images![0]?.url,
          }}
        />
        <View className="p-2">
          <Text
            className="text-lg tracking-tight text-gray-600"
            numberOfLines={1}
          >
            {post.title}
          </Text>
          <Text className="mb-1 font-bold text-sky-900">
            {post.price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'EUR',
            })}
          </Text>
        </View>
      </View>
    </Link>
  )
}

export const DetailedPostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/profile/selling/post/${post.id}`}>
      <View className="flex flex-row justify-between border-b border-gray-300">
        <View className="flex flex-row gap-2">
          <Image
            className="h-[12vh] w-[15vh] bg-gray-300"
            source={{
              uri: post.images![0]?.url,
            }}
          />
          <View className="flex flex-col items-start">
            <Text className="text-lg tracking-tight text-gray-600">
              {post.title}
            </Text>
            <Text className="mb-1 font-bold text-sky-900">
              {post.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR',
              })}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  )
}

export function PostScreen({ route }) {
  const router = useRouter()

  const { userId } = useAuth()

  const { postId } = route.params

  const { data: post } = trpc.post.getById.useQuery(postId)

  const { mutate: findOrCreateChatMutation } =
    trpc.chat.findOrCreate.useMutation()

  const context = trpc.useContext()

  const { mutate: removePostMutation, isLoading } =
    trpc.post.remove.useMutation({
      onSuccess: (removedPost) => {
        context.post.list.invalidate()
        context.post.listMine.setData(undefined, (oldPosts) => {
          if (oldPosts) {
            return oldPosts.filter((post) => post.id !== removedPost.id)
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

  const onRemovePostPress = () => {
    removePostMutation({ postId: post!.id })
  }

  // const onMarkPostAsSoldPress = () => {
  //   markAsSold({ postId: post!.id })
  // }

  const onContactButtonPress = () => {
    findOrCreateChatMutation(
      {
        postId,
        partnerId: post!.authorId,
      },
      {
        onSuccess: (chat) => {
          router.push(`/post/${postId}/contact/${chat?.id}`)
        },
      }
    )
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
        {userId === post.authorId && (
          <View className="p-4">
            <Button
              loading={isLoading}
              className="w-full"
              title="Remove post"
              onPress={onRemovePostPress}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
