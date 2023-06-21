import { trpc } from 'app/utils/trpc'
import { SafeAreaView } from 'react-native'
import { View, TouchableOpacity } from 'app/design/core'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'
import {
  buttonVariants,
  textVariants,
  shapeVariants,
  iconColorVariants,
} from 'app/components/button'
import { Placeholder } from 'app/components/placeholder'
import { PostList } from '../post/post-list'

export function SellingScreen() {
  const router = useRouter()

  const { data: posts } = trpc.post.listMine.useQuery()

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <View className="h-full w-full">
        <PostList
          posts={posts}
          ListEmptyComponent={
            <Placeholder
              icon={<MaterialCommunityIcons name="inbox" />}
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
          }
        />
      </View>
    </SafeAreaView>
  )
}
