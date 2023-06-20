import { FlatList, SafeAreaView } from 'react-native'
import { PostList } from '../post/post-list'
import { View, TextInput, TouchableOpacity } from 'app/design/core'
import { trpc } from 'app/utils/trpc'
import Svg, { Path } from 'react-native-svg'
import { useState } from 'react'
import { Placeholder } from 'app/components/placeholder'
import { MaterialIcons } from '@expo/vector-icons'
import { Text } from 'app/design/typography'
import { Keyboard } from 'react-native'
import { PostCategory, PostCategoryTitles } from 'app/utils/enums'
import { LoadingSpinner } from 'app/components/spinner'
import { Tag } from 'app/components/tag'

export function SearchScreen() {
  const [searchInput, setSearchInput] = useState<string>()
  const [searchQuery, setSearchQuery] = useState<string>()

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState<PostCategory[]>(
    []
  )

  const { data: posts, isLoading } = trpc.post.search.useQuery({
    query: searchQuery,
    categories: selectedCategories,
  })

  const onSearch = () => {
    setSearchQuery(searchInput)
  }

  const onCancel = () => {
    Keyboard.dismiss()
    setSearchInput(undefined)
    setSearchQuery(undefined)
  }

  const onPressCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <SafeAreaView>
      <View className="border-b border-gray-300 p-4 pb-3">
        <View className="mb-3 flex flex-row items-center">
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </Svg>
            </View>
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              className="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 pl-10 text-[17px] text-gray-900"
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
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Object.keys(PostCategory)}
          keyExtractor={(category) => category}
          renderItem={({ item: category }) => {
            const isSelected = selectedCategories.includes(category)
            return (
              <TouchableOpacity onPress={() => onPressCategory(category)}>
                <Tag
                  textClassName="mr-2 rounded px-3 py-2"
                  label={PostCategoryTitles.get(category)}
                  color={isSelected ? 'blue' : 'neutral'}
                />
              </TouchableOpacity>
            )
          }}
        />
      </View>
      {isLoading && (
        <View className="mt-32 flex items-center">
          <LoadingSpinner size={40} />
        </View>
      )}
      {!isLoading && posts?.length ? <PostList posts={posts} /> : null}
      {!isLoading && !posts?.length ? (
        <Placeholder
          icon={<MaterialIcons name="search-off" size={40} color="black" />}
          title="No posts found"
          description="We couldn't find any posts that match your search."
        />
      ) : null}
    </SafeAreaView>
  )
}
