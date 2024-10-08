import { View } from 'app/design/core'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { PostCard, SkeletonPostCard } from '../post/cards'
import { useWindowDimensions } from 'react-native'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'api/routers'
import React from 'react'

type Post = inferProcedureOutput<AppRouter['post']['getById']>

interface PostListProps
  extends Omit<FlashListProps<Post>, 'data' | 'renderItem'> {
  posts: Post[] | undefined
  isLoading: boolean
  firstRowPadding?: boolean
}

export const PostList = React.forwardRef<any, PostListProps>(
  ({ posts, isLoading, firstRowPadding = false, ...props }, ref) => {
    const { height } = useWindowDimensions()

    const renderItem = ({ item: post, index }) => {
      const paddingX = index % 2 === 0 ? 'pr-2' : 'pl-2'
      const paddingTop = firstRowPadding && index < 2 ? 'pt-4' : ''

      return (
        <View className={`w-full pb-4 ${paddingX} ${paddingTop}`}>
          {isLoading ? <SkeletonPostCard /> : <PostCard post={post} />}
        </View>
      )
    }

    return (
      <View className="h-full w-full px-4">
        {isLoading ? (
          <FlashList
            ref={ref}
            data={Array(6)}
            keyExtractor={(_, i) => i.toString()}
            numColumns={2}
            estimatedItemSize={0.35 * height}
            renderItem={renderItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            {...props}
          />
        ) : (
          <FlashList
            ref={ref}
            data={posts}
            keyExtractor={(post) => post.id}
            numColumns={2}
            estimatedItemSize={0.35 * height}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            {...props}
          />
        )}
      </View>
    )
  },
)
