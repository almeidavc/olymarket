import { trpc } from 'app/utils/trpc'
import { SafeAreaView } from 'react-native'
import { View, TouchableOpacity } from 'app/design/core'
import { AntDesign } from '@expo/vector-icons'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'
import {
  buttonVariants,
  textVariants,
  shapeVariants,
  iconColorVariants,
} from 'app/components/button'
import { InboxIcon } from 'react-native-heroicons/outline'
import { Placeholder } from 'app/components/placeholder'
import { PostList } from '../post/post-list'

export function SellingScreen() {
  const router = useRouter()

  const { data: posts, isLoading } = trpc.post.listMine.useQuery()

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <View className="h-full w-full">
        <PostList
          posts={posts}
          isLoading={isLoading}
          firstRowPadding={true}
          ListEmptyComponent={
            <Placeholder
              icon={<InboxIcon color={'black'} />}
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
