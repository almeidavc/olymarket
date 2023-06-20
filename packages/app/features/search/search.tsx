import { SafeAreaView } from 'react-native'
import { PostList } from '../post/post-list'
import { View, TextInput, TouchableOpacity } from 'app/design/core'
import { trpc } from 'app/utils/trpc'
import Svg, { Path } from 'react-native-svg'
import { useState } from 'react'
import { Placeholder } from 'app/components/placeholder'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'
import { Text } from 'app/design/typography'
import { Keyboard } from 'react-native'

export function SearchScreen() {
  const [searchInput, setSearchInput] = useState<string>()
  const [searchQuery, setSearchQuery] = useState<string>()

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)

  const { data: posts } = trpc.post.search.useQuery(
    { query: searchQuery! },
    { enabled: !!searchQuery }
  )

  const onSearch = () => {
    if (searchInput) {
      setSearchQuery(searchInput)
    }
  }

  const onCancel = () => {
    Keyboard.dismiss()
    setSearchInput(undefined)
    setSearchQuery(undefined)
  }

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4">
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
      {!searchQuery && (
        <Placeholder
          title="Search posts"
          description="Find things to buy."
          icon={
            <Svg
              width={80}
              height={80}
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
          }
        />
      )}
      {searchQuery && posts?.length ? <PostList posts={posts} /> : null}
      {searchQuery && !posts?.length ? (
        <Placeholder
          icon={<MaterialIcons name="search-off" size={40} color="black" />}
          title="Empty"
          description="Empty"
        />
      ) : null}
    </SafeAreaView>
  )
}
