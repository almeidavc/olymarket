import { CreatePostScreen } from '../../features/post/create-post'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SignInScreen } from 'app/features/onboarding/sign-in'
import { SignUpScreen } from 'app/features/onboarding/sign-up'
import { VerifyEmailScreen } from 'app/features/onboarding/verify-email'
import { Home } from 'app/features/home'
import { Profile } from 'app/features/profile'
import { Chat } from 'app/features/chat'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

const tabIcons = {
  home: 'home',
  post: 'plus',
  profile: 'user',
  chats: 'comments',
}

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export function Navigation() {
  return (
    <>
      <SignedIn>
        <Tab.Navigator
          initialRouteName="home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5
                name={tabIcons[route.name]}
                size={size}
                color={color}
              />
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
            options={{ tabBarLabel: 'Chats', headerShown: false }}
          />
          <Tab.Screen
            name="profile"
            component={Profile}
            options={{ headerTitle: 'Profile', tabBarLabel: 'Profile' }}
          />
        </Tab.Navigator>
      </SignedIn>
      <SignedOut>
        <Stack.Navigator initialRouteName="Sign In">
          <Stack.Screen
            name="sign-in"
            component={SignInScreen}
            options={{ title: 'Sign In' }}
          />
          <Stack.Screen
            name="sign-up"
            component={SignUpScreen}
            options={{ title: 'Sign Up' }}
          />
          <Stack.Screen
            name="verify"
            component={VerifyEmailScreen}
            options={{ title: 'Verify email' }}
          />
        </Stack.Navigator>
      </SignedOut>
    </>
  )
}
