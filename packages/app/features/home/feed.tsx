import { H1, Text } from 'app/design/typography'
import { View } from 'app/design/core'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'api/routers'
import { FlatList } from 'react-native'
import { Link } from 'solito/link'

interface PostCardProps {
  post: inferProcedureOutput<AppRouter['post']['list']>[number]
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
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

export function FeedScreen() {
  const { data: posts } = trpc.post.list.useQuery()

  return (
    <View className="p-4">
      <FlatList
        ListHeaderComponent={<H1>Olymarket</H1>}
        data={posts}
        keyExtractor={(post) => post.id}
        numColumns={2}
        renderItem={({ item: post, index }) => (
          <View className={`w-1/2 py-2 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}>
            <PostCard key={post.id} post={post} />
          </View>
        )}
      />
    </View>
  )
}