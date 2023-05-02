import { useSignIn } from '@clerk/clerk-expo'
import { View } from 'app/design/core'
import { useState } from 'react'
import { TextInput, Button } from 'app/design/core'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'

export function SignInScreen() {
  const router = useRouter()
  const { signIn, setActive } = useSignIn()

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPress = async () => {
    await signIn?.create({
      identifier: usernameOrEmail,
      password: password,
    })
    setActive?.({ session: signIn?.createdSessionId })
  }

  const onSignUpPress = () => {
    router.push('/sign-up')
  }

  return (
    <View className="p-4">
      <View className="flex flex-col gap-1">
        <Text>Username or email</Text>
        <TextInput value={usernameOrEmail} onChangeText={setUsernameOrEmail} />
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} />
        <Button title="Continue" onPress={onSignInPress} variant="secondary" />
      </View>
      <View className="mt-5 border-b border-neutral-400" />
      <Button
        title="Sign up for Olymarket"
        onPress={onSignUpPress}
        className="mt-5"
      />
    </View>
  )
}
