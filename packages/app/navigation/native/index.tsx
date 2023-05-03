import { CreatePostScreen } from '../../features/post/create-post-screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SignInScreen } from 'app/features/onboarding/sign-in'
import { SignUpScreen } from 'app/features/onboarding/sign-up'
import { VerifyEmailScreen } from 'app/features/onboarding/verify-email'
import { Home } from 'app/features/home'
import { Profile } from 'app/features/profile'

const tabIcons = {
  home: 'home',
  post: 'plus',
  profile: 'user',
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
            options={{ headerShown: false, tabBarLabel: 'Home' }}
          />
          <Tab.Screen
            name="post"
            component={CreatePostScreen}
            options={{ headerTitle: 'Sell an item', tabBarLabel: 'Post' }}
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
