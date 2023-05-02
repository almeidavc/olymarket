import { useSignUp } from '@clerk/clerk-expo'
import { TextInput, View, Button } from 'app/design/core'
import { Text } from 'app/design/typography'
import { useState } from 'react'
import Toast from 'react-native-root-toast'

export function VerifyEmailScreen() {
  const { signUp, setActive } = useSignUp()

  const [verificationCode, setVerificationCode] = useState('')

  const onVerifyEmailPress = async () => {
    try {
      const res = await signUp?.attemptEmailAddressVerification({
        code: verificationCode,
      })
      if (res?.status === 'complete') {
        // setting the active session renders the tab navigator automatically
        setActive?.({ session: signUp?.createdSessionId })
      }
    } catch (error) {
      Toast.show(error.errors[0].longMessage)
    }
  }

  return (
    <View className="p-4">
      <Text className="text-xl font-bold">Enter 6-digit code</Text>
      <Text>{`The code was sent to ${signUp?.emailAddress}.`}</Text>
      <TextInput
        placeholder="444444"
        inputMode="numeric"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <Button title="Verify email" onPress={onVerifyEmailPress} />
    </View>
  )
}
