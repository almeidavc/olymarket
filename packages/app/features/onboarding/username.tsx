import { useSignUp } from '@clerk/clerk-expo'
import Toast from 'react-native-root-toast'
import { View } from 'app/design/core'
import { useState } from 'react'
import { TextInput } from 'app/design/core'
import { Button } from 'app/design/button'
import { Text } from 'app/design/typography'

export function ChooseUsernameScreen() {
  const { signUp, setActive } = useSignUp()

  const [username, setUsername] = useState('')

  const onSignUpPress = async () => {
    try {
      const res = await signUp?.update({
        username: username,
      })
      if (res?.status === 'complete') {
        setActive?.({ session: signUp?.createdSessionId })
      }
    } catch (error) {
      Toast.show(error.errors[0].longMessage)
    }
  }

  return (
    <View className="p-4">
      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} />
      <Button title="Sign up" onPress={onSignUpPress} />
    </View>
  )
}
