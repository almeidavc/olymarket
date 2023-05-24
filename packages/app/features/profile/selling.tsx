import { trpc } from 'app/utils/trpc'
import { DetailedPostCard } from '../post/post'
import { FlatList } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PostScreen } from '../post/post'

const Stack = createNativeStackNavigator()

export function Selling() {
  return (
    <Stack.Navigator initialRouteName="feed">
      <Stack.Screen
        name="feed"
        component={SellingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="post"
        component={PostScreen}
        options={{
          headerTransparent: true,
          headerTintColor: 'white',
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  )
}

export function SellingScreen() {
  const { data: posts } = trpc.post.listMine.useQuery()

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.id}
      renderItem={({ item: post }) => <DetailedPostCard post={post} />}
    />
  )
}
