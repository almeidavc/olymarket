import { useSignUp } from '@clerk/clerk-expo'
import { View } from 'app/design/core'
import { useRouter } from 'solito/router'
import { FormInput } from 'app/components/form'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native'
import { Button } from 'app/components/button'

export function SignUpScreen() {
  const router = useRouter()

  const { signUp } = useSignUp()

  const { control, handleSubmit, setError } = useForm()

  const onSignUp = async ({ email, password }) => {
    try {
      const signUpResult = await signUp?.create({
        emailAddress: email,
        password,
      })

      if (!signUpResult) {
        return
      }

      if (signUpResult.unverifiedFields.includes('email_address')) {
        await signUpResult.prepareEmailAddressVerification()
        router.push('/sign-up/verify-email')
      } else {
        router.push('sign-up/username')
      }
    } catch (e) {
      const error = e.errors[0]

      if (error.code === 'form_param_format_invalid') {
        setError('email', {
          message: 'Email must be a valid email address.',
        })
        return
      }

      switch (error.meta.paramName) {
        case 'email_address':
          setError('email', {
            message: error.longMessage,
          })
          break
        case 'password':
          setError('password', {
            message: error.longMessage,
          })
      }
    }
  }

  return (
    <SafeAreaView>
      <View className="p-4">
        <FormInput
          name="email"
          label="Email"
          control={control}
          rules={{
            required: 'Please enter an email address.',
          }}
          textInput={{
            placeholder: 'Email',
            returnKeyType: 'done',
          }}
        />
        <FormInput
          name="password"
          label="Password"
          control={control}
          rules={{
            required: 'Please enter a password.',
          }}
          textInput={{
            placeholder: 'Password',
            returnKeyType: 'done',
          }}
        />
        <Button
          className="mt-4"
          title="Continue"
          onPress={handleSubmit(onSignUp)}
        />
      </View>
    </SafeAreaView>
  )
}
