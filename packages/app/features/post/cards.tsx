import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { Image } from 'app/design/image'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { Link } from 'solito/link'
import { TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface PostCardProps {
  post: inferProcedureOutput<AppRouter['post']['list']>[number]
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigation = useNavigation()

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('post', { postId: post.id })}
    >
      <View className="flex h-full flex-col rounded-t-md">
        <View className="flex-1">
          <Image
            className="h-full w-full rounded-md"
            resizeMode="cover"
            source={{
              uri: post.images![0]?.url,
            }}
          />
        </View>
        <View>
          <Text className="mt-2" numberOfLines={1}>
            {post.title}
          </Text>
          <Text className="mt-1">
            {post.price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'EUR',
            })}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

interface HorizontalPostCardProps extends PostCardProps {
  href: string
  height: number
}

export const HorizontalPostCard: React.FC<HorizontalPostCardProps> = ({
  post,
  href,
  height,
}) => {
  return (
    <Link href={href}>
      <View className="flex flex-row border-b border-gray-300">
        <Image
          style={{ height, width: height }}
          className="mr-2 bg-gray-300"
          source={{
            uri: post.images![0]?.url,
          }}
        />
        <View className="flex flex-col items-start">
          <Text className="text-lg tracking-tight text-gray-600">
            {post.title}
          </Text>
          <Text className="font-bold text-sky-900">
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
