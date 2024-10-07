import { PostList } from '../post/post-list'
import { View, TextInput, TouchableOpacity } from 'app/design/core'
import { SafeAreaView, RefreshControl } from 'react-native'
import { trpc } from 'app/utils/trpc'
import Svg, { Path } from 'react-native-svg'
import { useEffect, useState, useRef } from 'react'
import { Placeholder } from 'app/components/placeholder'
import { Text } from 'app/design/typography'
import { Keyboard } from 'react-native'
import { PostCategory } from 'app/utils/enums'
import { LoadingSpinner } from 'app/components/spinner'
import { CategoriesList } from './categories'
import { useIsFocused } from '@react-navigation/native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'

export function SearchScreen({ navigation }) {
  const ref = useRef(null)

  const isFocused = useIsFocused()

  const [searchInput, setSearchInput] = useState<string>()
  const [searchQuery, setSearchQuery] = useState<string>()

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState<PostCategory[]>(
    [],
  )

  const { data, fetchNextPage, hasNextPage, refetch, isLoading } =
    trpc.post.search.useInfiniteQuery(
      {
        query: searchQuery,
        categories: selectedCategories,
      },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
      },
    )

  const posts = data?.pages.flatMap((page) => page.posts)

  const onSearch = () => {
    setSearchQuery(searchInput)
  }

  const onCancel = () => {
    Keyboard.dismiss()
    setSearchInput(undefined)
    setSearchQuery(undefined)
  }

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
    <SafeAreaView style={{ flex: 1 }}>
      <View className="mx-4 my-3 flex flex-row items-center">
        <View className="relative grow">
          <View className="absolute inset-y-0 left-0 z-10 flex flex-row items-center pl-4">
            <Svg
              width={20}
              height={20}
              fill="none"
              stroke="black"
              viewBox="0 0 24 24"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </Svg>
          </View>
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            className="bg-background rounded-full p-2.5 pl-11 text-[17px]"
            placeholder="Search posts"
            returnKeyType="search"
            onFocus={() => setIsSearchInputFocused(true)}
            onBlur={() => setIsSearchInputFocused(false)}
            onSubmitEditing={onSearch}
          />
        </View>
        {isSearchInputFocused && (
          <TouchableOpacity className="ml-2" onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-3 ml-4">
        <CategoriesList
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </View>
      <View className="flex-1">
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
          ListEmptyComponent={
            <Placeholder
              icon={<MagnifyingGlassIcon color="black" />}
              title="No posts found"
              description="We couldn't find any posts that match your search."
            />
          }
        />
      </View>
    </SafeAreaView>
  )
}
