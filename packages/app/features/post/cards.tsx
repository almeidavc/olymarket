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

interface HorizontalPostCardProps extends PostCardProps {
  href: string
}

export const HorizontalPostCard: React.FC<HorizontalPostCardProps> = ({
  post,
  href,
}) => {
  return (
    <Link href={href}>
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
