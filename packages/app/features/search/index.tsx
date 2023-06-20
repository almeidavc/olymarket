import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PostScreen } from '../post/post'
import { SearchScreen } from './search'

const Stack = createNativeStackNavigator()

export function Search() {
  return (
    <Stack.Navigator
      initialRouteName="feed"
      screenOptions={{ headerTintColor: 'black' }}
    >
      <Stack.Screen
        name="feed"
        component={SearchScreen}
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
