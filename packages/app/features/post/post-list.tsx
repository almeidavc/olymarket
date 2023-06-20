import { View } from 'app/design/core'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { PostCard } from '../post/cards'
import { useWindowDimensions } from 'react-native'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'

interface PostListProps {
  posts: inferProcedureOutput<AppRouter['post']['list']> | undefined
  header?: FlashListProps<any>['ListHeaderComponent']
  refreshControl?: FlashListProps<any>['refreshControl']
}

export function PostList({ posts, header, refreshControl }: PostListProps) {
  const { height } = useWindowDimensions()

  const renderItem = ({ item: post, index }) => {
    const paddingBetween = index % 2 === 0 ? 'pr-1' : 'pl-1'

    return (
      <View className={`h-[35vh] w-full py-1.5 ${paddingBetween}`}>
        <PostCard post={post} />
      </View>
    )
  }

  return (
    <View className="h-full w-full px-4">
      <FlashList
        data={posts}
        keyExtractor={(post) => post.id}
        numColumns={2}
        estimatedItemSize={0.35 * height}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        refreshControl={refreshControl}
      />
    </View>
  )
}
