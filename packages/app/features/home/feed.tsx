import { Header } from 'app/design/typography'
import { Placeholder } from 'app/components/placeholder'
import { SafeAreaView } from 'react-native'
import { PostList } from '../post/post-list'
import { trpc } from 'app/utils/trpc'
import { RefreshControl } from 'react-native'
import { View } from 'app/design/core'
import { CategoriesList } from '../search/categories'
import { useEffect, useRef, useState } from 'react'
import { PostCategory } from 'app/utils/enums'
import { useIsFocused } from '@react-navigation/native'
import { LoadingSpinner } from 'app/components/spinner'
import { FaceFrownIcon } from 'react-native-heroicons/outline'

export function FeedScreen({ navigation }) {
  const ref = useRef(null)

  const isFocused = useIsFocused()

  const [categories, setCategories] = useState<PostCategory[]>([])

  const { data, fetchNextPage, hasNextPage, refetch, isLoading } =
    trpc.post.list.useInfiniteQuery(
      { categories },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
      }
    )

  const posts = data?.pages.flatMap((page) => page.posts)

  useEffect(() => {
    const unsubscribe = navigation
      .getParent('tabs')
      .addListener('tabPress', () => {
        if (isFocused && ref.current) {
          ref.current.scrollToOffset({ animated: false, offset: 0 })
        }
      })
    return unsubscribe
  }, [isFocused])

  return (
    <SafeAreaView>
      <PostList
        ref={ref}
        posts={posts}
        isLoading={isLoading}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          posts?.length && hasNextPage ? (
            <View className="mt-4 flex items-center justify-center">
              <LoadingSpinner size={24} />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <View>
            <Header className="my-6">Olymarket</Header>
            <View className="mb-4">
              <CategoriesList
                selectedCategories={categories}
                setSelectedCategories={setCategories}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <Placeholder
            icon={<FaceFrownIcon color="black" />}
            title="No posts"
            description="We couldn't find any posts."
          />
        }
      />
    </SafeAreaView>
  )
}
