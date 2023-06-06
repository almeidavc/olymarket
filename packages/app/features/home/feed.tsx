import { H1 } from 'app/design/typography'
import { View } from 'app/design/core'
import { FlatList, SafeAreaView } from 'react-native'
import { trpc } from 'app/utils/trpc'
import { PostCard } from '../post/cards'
import { RefreshControl } from 'react-native'

export function FeedScreen() {
  const { data: posts, refetch, isRefetching } = trpc.post.list.useQuery()

  return (
    <SafeAreaView>
      <View className="px-4">
        <FlatList
          ListHeaderComponent={<H1>Olymarket</H1>}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={(post) => post.id}
          numColumns={2}
          renderItem={({ item: post, index }) => (
            <View
              className={`w-1/2 py-1.5 ${index % 2 === 0 ? 'pr-1' : 'pl-1'}`}
            >
              <PostCard post={post} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}
