import { useSignIn } from '@clerk/clerk-expo'
import { useState, useCallback } from 'react'
import { TextInput, View } from 'app/design/core'
import { Button } from 'app/design/button'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'
import { useOAuth } from '@clerk/clerk-expo'
import { useWarmUpBrowser } from 'app/utils/browser'

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
    <Button
      title="Continue with Google"
      variant="secondary"
      onPress={onSignInPress}
    />
  )
}

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
      <Button
        title="Sign up for Olymarket"
        onPress={onSignUpPress}
        className="mt-5"
      />
      <View className="mt-5 border-b border-neutral-400" />
      <SignInWithGoogle />
    </View>
  )
}
