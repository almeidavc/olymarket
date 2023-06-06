import { trpc } from 'app/utils/trpc'
import { FlatList, SafeAreaView } from 'react-native'
import { RefreshControl } from 'react-native'
import { HorizontalPostCard } from '../post/cards'

export function ModeratorScreen() {
  const {
    data: posts,
    refetch,
    isRefetching,
  } = trpc.post.listReported.useQuery()

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item: post }) => (
          <HorizontalPostCard
            post={post}
            href={`/profile/moderate/post/${post.id}`}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  )
}
