import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { Image } from 'app/design/image'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { Link } from 'solito/link'

interface PostCardProps {
  post: inferProcedureOutput<AppRouter['post']['list']>[number]
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/post/${post.id}`}>
      <View className="flex h-full flex-col rounded-lg border border-gray-300 bg-white shadow">
        <View className="flex-1">
          <Image
            className="h-full w-full rounded-t-lg"
            resizeMode="cover"
            source={{
              uri: post.images![0]?.url,
            }}
          />
        </View>
        <View className="p-2">
          <Text
            className="text-lg tracking-tight text-gray-600"
            numberOfLines={1}
          >
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
