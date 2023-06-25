import { useSignIn } from '@clerk/clerk-expo'
import { useContext } from 'react'
import { View } from 'app/design/core'
import { Button } from 'app/components/button'
import { Text } from 'app/design/typography'
import { SafeAreaView } from 'react-native'
import { useForm } from 'react-hook-form'
import { FormInput } from 'app/components/form'
import { OnboardingContext } from './context'

export function SignInScreen({ navigation }) {
  const { onOnboard } = useContext(OnboardingContext)

  const { signIn, setActive } = useSignIn()

  const { control, handleSubmit, setError } = useForm()

  const onSignIn = async ({ usernameOrEmail, password }) => {
    try {
      const signInResult = await signIn?.create({
        identifier: usernameOrEmail,
        password: password,
      })

      setActive?.({ session: signInResult?.createdSessionId })
      onOnboard()
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
    navigation.navigate('sign-up')
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
        <View className="divide-background divide-y">
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
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
