import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FeedScreen } from './feed'
import { PostScreen } from '../post/post-screen'

const Stack = createNativeStackNavigator()

export function Home() {
  return (
    <Stack.Navigator initialRouteName="feed">
      <Stack.Screen
        name="feed"
        component={FeedScreen}
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