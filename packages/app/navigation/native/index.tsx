import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from '../../features/home/screen'
import { CreatePostScreen } from '../../features/post/screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'

// const Stack = createNativeStackNavigator<{
//   home: undefined
//   'user-detail': {
//     id: string
//   }
// }>()

// export function NativeNavigation() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="home"
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//         }}
//       />
//       <Stack.Screen
//         name="user-detail"
//         component={UserDetailScreen}
//         options={{
//           title: 'User',
//         }}
//       />
//     </Stack.Navigator>
//   )
// }

const tabIcons = {
  Home: 'home',
  Post: 'plus',
}

const Tab = createBottomTabNavigator()

export function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={CreatePostScreen} />
    </Tab.Navigator>
  )
}
