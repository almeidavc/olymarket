import { trpc } from 'app/utils/trpc'
import { SafeAreaView, useWindowDimensions } from 'react-native'
import { HorizontalPostCard } from '../post/cards'
import { FlashList } from '@shopify/flash-list'
import { View, TouchableOpacity } from 'app/design/core'
import { RefreshControl } from 'react-native'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { Text } from 'app/design/typography'
import {
  buttonVariants,
  textVariants,
  shapeVariants,
  iconColorVariants,
} from 'app/components/button'
import { useRouter } from 'solito/router'

export function SellingScreen() {
  const router = useRouter()

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

  if (!posts?.length) {
    return (
      <SafeAreaView>
        <View className="mt-14 flex flex-col items-center p-4">
          <MaterialCommunityIcons name="inbox" size={40} />
          <Text className="mt-2 text-lg font-semibold">No posts yet</Text>
          <Text className="mt-2 text-center text-gray-600">
            It seems like you haven't created any posts. Create posts to sell
            your old items.
          </Text>
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push('/post')}
          >
            <View
              className={`${buttonVariants['primary']} ${shapeVariants['primary']}`}
            >
              <AntDesign
                name="plus"
                color={iconColorVariants['primary']}
                size={16}
              />
              <Text className={`${textVariants['primary']} ml-1`}>
                New post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

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
