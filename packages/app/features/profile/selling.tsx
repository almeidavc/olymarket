import { trpc } from 'app/utils/trpc'
import { SafeAreaView, useWindowDimensions } from 'react-native'
import { HorizontalPostCard } from '../post/cards'
import { FlashList } from '@shopify/flash-list'
import { View } from 'app/design/core'
import { RefreshControl } from 'react-native'

export function SellingScreen() {
  const { height } = useWindowDimensions()

  const { data: posts, refetch, isRefetching } = trpc.post.listMine.useQuery()

  const postCardHeight = 0.15 * height

  const renderItem = ({ item: post }) => (
    <HorizontalPostCard
      post={post}
      href={`/profile/selling/post/${post.id}`}
      height={postCardHeight}
    />
  )

  return (
    <SafeAreaView>
      <View className="h-full w-full">
        <FlashList
          data={posts}
          keyExtractor={(post) => post.id}
          estimatedItemSize={postCardHeight}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      </View>
    </SafeAreaView>
  )
}
