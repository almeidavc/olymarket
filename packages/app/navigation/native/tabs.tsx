import { CreatePost } from '../../features/post/create'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { Home } from 'app/features/home'
import { Profile } from 'app/features/profile'
import { InboxScreen } from 'app/features/inbox'
import { useAuth } from '@clerk/clerk-expo'
import { Search } from 'app/features/search'

const protectedRoutes = ['post', 'chats', 'profile']

const tabIcons = {
  home: 'home',
  search: 'search',
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
      id="tabs"
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
        options={{ headerShown: false, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{ headerShown: false, tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="post"
        component={CreatePost}
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
