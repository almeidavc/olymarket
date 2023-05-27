import { useSignUp } from '@clerk/clerk-expo'
import Toast from 'react-native-root-toast'
import { View } from 'app/design/core'
import { useState } from 'react'
import { TextInput } from 'app/design/core'
import { Button } from 'app/design/button'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'

export function SignUpScreen() {
  const router = useRouter()

  const { signUp } = useSignUp()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSignUpPress = async () => {
    try {
      const res = await signUp?.create({
        emailAddress: email,
        password,
      })
      if (!res) {
        throw new Error('An error occured when signing up with email')
      }
      if (res.unverifiedFields.includes('email_address')) {
        await signUp?.prepareEmailAddressVerification()
        router.push('/sign-up/verify-email')
      } else {
        router.push('sign-up/username')
      }
    } catch (error) {
      Toast.show(error.errors[0].longMessage)
    }
  }

  return (
    <View className="p-4">
      <View className="flex flex-col gap-1">
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} />
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} />
        <Button title="Continue" onPress={onSignUpPress} />
      </View>
    </View>
  )
}
