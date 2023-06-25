import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SignInScreen } from 'app/features/onboarding/sign-in'
import { SignUpScreen } from 'app/features/onboarding/sign-up'
import { ChooseUsernameScreen } from 'app/features/onboarding/username'
import { VerifyEmailScreen } from 'app/features/onboarding/verify-email'
import { trpc } from 'app/utils/trpc'
import { OnboardingContext } from './context'

const Stack = createNativeStackNavigator()

export function Onboarding({ route, navigation }) {
  const { redirectTo } = route.params

  const context = trpc.useContext()

  const onOnboard = () => {
    context.post.listMine.prefetch()
    context.chat.list.prefetch()
    navigation.navigate('tabs', { screen: redirectTo })
  }

  return (
    <OnboardingContext.Provider value={{ onOnboard }}>
      <Stack.Navigator
        initialRouteName="Sign In"
        screenOptions={{
          headerTintColor: 'black',
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen
          name="sign-in"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          component={SignUpScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name="verify-email"
          component={VerifyEmailScreen}
          options={{ title: 'Verify email' }}
        />
        <Stack.Screen
          name="choose-username"
          component={ChooseUsernameScreen}
          options={{ title: 'Choose a username' }}
        />
      </Stack.Navigator>
    </OnboardingContext.Provider>
  )
}
