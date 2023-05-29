import { trpc } from 'app/utils/trpc'
import { DetailedPostCard } from '../post/post'
import { FlatList, SafeAreaView } from 'react-native'

export function SellingScreen() {
  const { data: posts } = trpc.post.listMine.useQuery()

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item: post }) => <DetailedPostCard post={post} />}
      />
    </SafeAreaView>
  )
}
