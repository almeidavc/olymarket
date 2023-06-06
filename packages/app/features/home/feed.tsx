import { H1 } from 'app/design/typography'
import { View } from 'app/design/core'
import { SafeAreaView } from 'react-native'
import { trpc } from 'app/utils/trpc'
import { RefreshControl } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { PostCard } from '../post/cards'
import { useWindowDimensions } from 'react-native'

export function FeedScreen() {
  const { height } = useWindowDimensions()

  const { data: posts, refetch, isRefetching } = trpc.post.list.useQuery()

  const renderItem = ({ item: post, index }) => {
    const paddingBetween = index % 2 === 0 ? 'pr-1' : 'pl-1'

    return (
      <View className={`h-[35vh] w-full py-1.5 ${paddingBetween}`}>
        <PostCard post={post} />
      </View>
    )
  }

  return (
    <SafeAreaView>
      <View className="h-full w-full px-4">
        <FlashList
          data={posts}
          keyExtractor={(post) => post.id}
          numColumns={2}
          estimatedItemSize={0.35 * height}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<H1>Olymarket</H1>}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      </View>
    </SafeAreaView>
  )
}
