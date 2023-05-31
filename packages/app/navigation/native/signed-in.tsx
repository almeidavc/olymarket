import { Post } from '../../features/post/create-post'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { Home } from 'app/features/home'
import { Profile } from 'app/features/profile'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { CommonActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ChatScreen } from 'app/features/chat'
import { ChatScreenHeader } from 'app/features/chat/header'
import { InboxScreen } from 'app/features/inbox'

const tabIcons = {
  home: 'home',
  post: 'plus',
  profile: 'user',
  chats: 'comments',
}

const Tab = createBottomTabNavigator()

export function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0369a1',
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

const Stack = createNativeStackNavigator()

export function SignedInNavigator() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'main-tabs' }],
      })
    )
  }, [])

  return (
    <Stack.Navigator
      initialRouteName="main-tabs"
      screenOptions={{ headerTintColor: 'black' }}
    >
      <Stack.Screen
        name="main-tabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerTitle: () => <ChatScreenHeader chatId={route.params.chatId} />,
        })}
      />
    </Stack.Navigator>
  )
}
