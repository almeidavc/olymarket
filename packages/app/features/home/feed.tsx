import { Header } from 'app/design/typography'
import { Placeholder } from 'app/components/placeholder'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native'
import { PostList } from '../post/post-list'
import { trpc } from 'app/utils/trpc'
import { RefreshControl } from 'react-native'
import { View } from 'app/design/core'
import { CategoriesList } from '../search/categories'
import { useState } from 'react'
import { PostCategory } from 'app/utils/enums'

export function FeedScreen() {
  const [categories, setCategories] = useState<PostCategory[]>([])

  const { data: posts, refetch } = trpc.post.list.useQuery({
    categories,
  })

  return (
    <SafeAreaView>
      <PostList
        posts={posts}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <View>
            <Header className="my-6">Olymarket</Header>
            <View className="mb-6">
              <CategoriesList
                selectedCategories={categories}
                setSelectedCategories={setCategories}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <Placeholder
            icon={<AntDesign name="frowno" color="black" />}
            title="No posts"
            description="We couldn't find any posts."
          />
        }
      />
    </SafeAreaView>
  )
}
