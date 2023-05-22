import { CreatePostScreen } from '../../features/post/create-post'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { Home } from 'app/features/home'
import { Profile } from 'app/features/profile'
import { Chat } from 'app/features/chat'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { CommonActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

const tabIcons = {
  home: 'home',
  post: 'plus',
  profile: 'user',
  chats: 'comments',
}

const Tab = createBottomTabNavigator()

export function SignedInNavigator() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'home' }],
      })
    )
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'feed'
          return {
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarStyle:
              routeName === 'contact' ? { display: 'none' } : undefined,
          }
        }}
      />
      <Tab.Screen
        name="post"
        component={CreatePostScreen}
        options={{ headerTitle: 'Sell an item', tabBarLabel: 'Post' }}
      />
      <Tab.Screen
        name="chats"
        component={Chat}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'inbox'
          return {
            headerShown: false,
            tabBarLabel: 'Chats',
            tabBarStyle: routeName === 'chat' ? { display: 'none' } : undefined,
          }
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{ headerTitle: 'Profile', tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  )
}
