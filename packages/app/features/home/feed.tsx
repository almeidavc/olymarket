import { H1 } from 'app/design/typography'
import { View } from 'app/design/core'
import { FlatList } from 'react-native'
import { trpc } from 'app/utils/trpc'
import { PostCard } from '../post/post'
import { RefreshControl } from 'react-native'

export function FeedScreen() {
  const { data: posts, refetch, isRefetching } = trpc.post.list.useQuery()

  return (
    <View className="p-4">
      <FlatList
        ListHeaderComponent={<H1>Olymarket</H1>}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        data={posts}
        keyExtractor={(post) => post.id}
        numColumns={2}
        renderItem={({ item: post, index }) => (
          <View className={`w-1/2 py-2 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}>
            <PostCard post={post} />
          </View>
        )}
      />
    </View>
  )
}
