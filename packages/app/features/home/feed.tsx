import { Text } from 'app/design/typography'
import { SafeAreaView } from 'react-native'
import { PostList } from '../post/post-list'
import { trpc } from 'app/utils/trpc'
import { RefreshControl } from 'react-native'

export function FeedScreen() {
  const { data: posts, refetch, isRefetching } = trpc.post.list.useQuery()

  return (
    <SafeAreaView>
      <PostList
        posts={posts}
        header={
          <Text
            className="my-4 text-5xl font-bold text-sky-700"
            style={{ fontFamily: 'Cormorant-Bold' }}
          >
            Olymarket
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  )
}
