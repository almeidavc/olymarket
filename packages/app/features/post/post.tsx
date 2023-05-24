import { View, Button } from 'app/design/core'
import { Text, H1 } from 'app/design/typography'
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
import { Feather } from '@expo/vector-icons'
import { PostStatus } from '@prisma/client'
import { Tag } from 'app/components/tag'
import { PostStatusTitles, PostStatusColors } from 'app/utils/enums'
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu'

export const PostStatusTag = ({ status }: { status: PostStatus }) => {
  return (
    <Tag
      label={PostStatusTitles.get(status)}
      color={PostStatusColors.get(status)}
    />
  )
}

interface PostCardProps {
  post: inferProcedureOutput<AppRouter['post']['list']>[number]
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/post/${post.id}`}>
      <View className="flex h-[30vh] flex-col justify-between rounded-lg border-2 border-lime-800 p-4">
        <Image
          className="h-2/3 w-full bg-black"
          source={{
            uri: post.images![0]?.url,
          }}
          resizeMode="contain"
        />
        <View>
          <Text className="text-lg font-semibold text-lime-900">
            {post.title}
          </Text>
          <Text className="text-lime-900">
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
  const { mutate: removePostMutation } = trpc.post.remove.useMutation()
  const { mutate: markAsSold } = trpc.post.markAsSold.useMutation()

  const onRemovePostPress = () => {
    removePostMutation({ postId: post?.id })
  }

  const onMarkPostAsSoldPress = () => {
    markAsSold({ postId: post?.id })
  }

  return (
    <Link href={`/selling/post/${post.id}`}>
      <View className="flex flex-row justify-between border-b">
        <View className="flex flex-row gap-2">
          <Image
            className="h-[12vh] w-[15vh] bg-black"
            source={{
              uri: post.images![0]?.url,
            }}
            resizeMode="contain"
          />
          <View>
            <Text className="text-lg font-semibold text-lime-900">
              {post.title}
            </Text>
            <Text className="text-lime-900">
              {post.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR',
              })}
            </Text>
            {(post?.status === 'REMOVED' || post?.status === 'SOLD') && (
              <PostStatusTag status={post?.status} />
            )}
          </View>
        </View>
        <Menu>
          <MenuTrigger>
            <View className="p-2">
              <Feather name="more-horizontal" />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption text="Mark as sold" onSelect={onMarkPostAsSoldPress} />
            <MenuOption text="Remove post" onSelect={onRemovePostPress} />
          </MenuOptions>
        </Menu>
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
      <ScrollView horizontal={true}>
        {post.images.map((img) => (
          <Image
            className="aspect-square w-screen"
            key={img.id}
            source={{ uri: img.url }}
          />
        ))}
      </ScrollView>
      <View className="p-4">
        <H1 className="mb-0 text-3xl font-bold">{post.title}</H1>
        <Text className="text-lg font-extrabold text-blue-900">
          {new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }).format(post.price)}
        </Text>
        {post.zone !== 'NONE' && (
          <Text>
            <FontAwesome5 name="map-marker-alt" /> {ZoneTitles.get(post.zone)}
          </Text>
        )}
        <Text className="mt-4">Description</Text>
        <Text className="text-lg">{post.description}</Text>
        {userId !== post?.authorId && (
          <Button
            className="mt-4"
            title="Contact seller"
            onPress={onContactButtonPress}
          />
        )}
      </View>
    </ScrollView>
  )
}
