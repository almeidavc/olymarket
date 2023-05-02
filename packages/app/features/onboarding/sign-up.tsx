import { useSignUp } from '@clerk/clerk-expo'
import Toast from 'react-native-root-toast'
import { View } from 'app/design/core'
import { useState } from 'react'
import { TextInput, Button } from 'app/design/core'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'

export function SignUpScreen() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signUp } = useSignUp()

  const onSignUpPress = async () => {
    try {
      const result = await signUp?.create({
        username: username,
        emailAddress: email,
        password,
      })
      console.log(result?.emailAddress)
      const res = await signUp?.prepareEmailAddressVerification()
      console.log(res)
      router.push('/sign-up/verify')
    } catch (error) {
      Toast.show(error.errors[0].longMessage)
    }
  }

  return (
    <View className="p-4">
      <View className="flex flex-col gap-1">
        <Text>Username</Text>
        <TextInput value={username} onChangeText={setUsername} />
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} />
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} />
        <Button title="Continue" onPress={onSignUpPress} />
      </View>
    </View>
  )
}
