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
import { Placeholder } from 'app/components/placeholder'

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
        <Placeholder
          icon={<MaterialCommunityIcons name="inbox" size={40} />}
          title="No posts yet"
          description="It seems like you haven't created any posts. Create posts to sell your old items."
          extra={
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
          }
        />
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
