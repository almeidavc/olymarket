import { View } from 'app/design/core'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { PostCard } from '../post/cards'
import { useWindowDimensions } from 'react-native'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import React from 'react'

type Post = inferProcedureOutput<AppRouter['post']['list']>[number]

interface PostListProps
  extends Omit<FlashListProps<Post>, 'data' | 'renderItem'> {
  posts: Post[] | undefined
}

export const PostList = React.forwardRef<any, PostListProps>(
  ({ posts, ...props }, ref) => {
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
          ref={ref}
          data={posts}
          keyExtractor={(post) => post.id}
          numColumns={2}
          estimatedItemSize={0.35 * height}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          {...props}
        />
      </View>
    )
  }
)
