import { useSignIn } from '@clerk/clerk-expo'
import { useCallback } from 'react'
import { TouchableOpacity, View } from 'app/design/core'
import { Button } from 'app/components/button'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'
import { useOAuth } from '@clerk/clerk-expo'
import { useWarmUpBrowser } from 'app/utils/browser'
import { SafeAreaView } from 'react-native'
import { useForm } from 'react-hook-form'
import { FormInput } from 'app/components/form'
import Svg, { Path } from 'react-native-svg'

function SignInWithGoogle() {
  useWarmUpBrowser()

  const router = useRouter()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onSignInPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, authSessionResult } =
        await startOAuthFlow()

      if (createdSessionId) {
        setActive?.({ session: createdSessionId })
      } else if (authSessionResult?.type === 'success') {
        router.push('/sign-up/username')
      }
    } catch (error) {
      console.error('OAuth error', error)
    }
  }, [])

  return (
    <TouchableOpacity
      onPress={onSignInPress}
      className="mb-2 inline-flex flex-row items-center justify-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center"
    >
      <Svg
        width={16}
        height={16}
        data-prefix="fab"
        data-icon="google"
        role="img"
        viewBox="0 0 488 512"
      >
        <Path
          fill="white"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></Path>
      </Svg>
      <Text className="ml-2 text-sm font-medium text-white">
        Continue with Google
      </Text>
    </TouchableOpacity>
  )
}

export function SignInScreen() {
  const router = useRouter()

  const { signIn, setActive } = useSignIn()

  const { control, handleSubmit, setError } = useForm()

  const onSignIn = async ({ usernameOrEmail, password }) => {
    try {
      const signInResult = await signIn?.create({
        identifier: usernameOrEmail,
        password: password,
      })

      setActive?.({ session: signInResult?.createdSessionId })
    } catch (error) {
      switch (error.errors[0].code) {
        case 'form_identifier_not_found':
        case 'form_param_format_invalid':
          setError('usernameOrEmail', {
            message: 'The username or email you provided is invalid.',
          })
          break
        case 'form_password_incorrect':
          setError('password', {
            message: 'The password is incorrect.',
          })
          break
        case 'strategy_for_user_invalid':
          setError('usernameOrEmail', {})
          setError('password', {
            message: 'Please sign in with Google.',
          })
          break
        default:
          setError('usernameOrEmail', {})
          setError('password', {
            message: error.errors[0].longMessage,
          })
      }
    }
  }

  const onSignUpPress = () => {
    router.push('/sign-up')
  }

  return (
    <SafeAreaView>
      <View className="p-4">
        <Text
          className="my-10 text-center text-5xl font-bold text-sky-700"
          style={{ fontFamily: 'Cormorant-Bold' }}
        >
          Olymarket
        </Text>
        <View className="divide-y divide-gray-300">
          <View className="pb-4">
            <FormInput
              name="usernameOrEmail"
              label="Username or email"
              control={control}
              rules={{
                required: 'Please enter your username or email address.',
              }}
              textInput={{
                placeholder: 'Username or email',
                returnKeyType: 'done',
              }}
            />
            <FormInput
              name="password"
              label="Password"
              control={control}
              rules={{
                required: 'Please enter your password.',
              }}
              textInput={{
                placeholder: 'Password',
                returnKeyType: 'done',
                secureTextEntry: true,
                textContentType: 'password',
              }}
            />
            <Button
              title="Continue"
              onPress={handleSubmit(onSignIn)}
              variant="secondary"
            />
          </View>
          <View className="py-4">
            <Button
              className="mb-4"
              title="Sign up for Olymarket"
              onPress={onSignUpPress}
            />
            <SignInWithGoogle />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
