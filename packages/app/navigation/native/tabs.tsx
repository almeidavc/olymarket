import { Post } from '../../features/post/create'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { Home } from 'app/features/home'
import { Profile } from 'app/features/profile'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { InboxScreen } from 'app/features/inbox'
import { useAuth } from '@clerk/clerk-expo'

const protectedRoutes = ['post', 'chats', 'profile']

const tabIcons = {
  home: 'home',
  post: 'plus',
  profile: 'user',
  chats: 'comments',
}

const Tab = createBottomTabNavigator()

export function Tabs({ navigation }) {
  const { isSignedIn } = useAuth()

  const openModal = (redirectTo: string) => {
    navigation.getParent('root').navigate('onboarding', { redirectTo })
  }

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0369a1',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
      screenListeners={({ route }) => {
        const isProtectedRoute = protectedRoutes.includes(route.name)

        return {
          tabPress: (e) => {
            if (isProtectedRoute && !isSignedIn) {
              e.preventDefault()
              openModal(route.name)
            }
          },
        }
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'feed'
          return {
            headerShown: false,
            tabBarLabel: 'Home',
          }
        }}
      />
      <Tab.Screen
        name="post"
        component={Post}
        options={{ headerTitle: 'Sell an item', tabBarLabel: 'Post' }}
      />
      <Tab.Screen
        name="chats"
        component={InboxScreen}
        options={{ headerTitle: 'Chats', tabBarLabel: 'Chats' }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{ headerShown: false, tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  )
}
